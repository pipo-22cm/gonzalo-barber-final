import { VentaModel } from '../models/ventaModel.js'
import { ProductoModel } from '../models/productoModel.js'
import { UsuarioModel } from '../models/usuarioModel.js'
import { STOCK_MINIMO, ZONA_HORARIA } from '../config/negocio.js'

const ESTADOS_VENTA = ['pendiente', 'completado', 'cancelado']
const TIPOS_VENTA = ['web', 'mostrador']


async function prepararItems(productosCarrito) {
    const ids = productosCarrito.map(p => p.producto_id)
    const productos = await ProductoModel.productosPorIds(ids)

    const items = []
    let totalCentavos = 0

    for (const pedido of productosCarrito) {
        const producto = productos.find(p => p.id_producto === pedido.producto_id)

        if (!producto || !producto.estado) {
            return { status: 400, mensaje: `El producto ${pedido.producto_id} no existe o no está disponible` }
        }
        if (producto.stock < pedido.cantidad) {
            return { status: 409, mensaje: `Stock insuficiente de ${producto.nombre}: quedan ${producto.stock} unidades` }
        }

        const precioCentavos = Math.round(Number(producto.precio) * 100)
        totalCentavos += precioCentavos * pedido.cantidad

        items.push({
            producto_id: producto.id_producto,
            cantidad: pedido.cantidad,
            precio_unitario: producto.precio
        })
    }

    return { items, total: totalCentavos / 100 }
}


function puedeVerVenta(usuario, venta) {
    return usuario.rol === 'admin' || venta.usuario_id === usuario.id
}

export class VentaController {

    static async crearPedido(req, res) {
        const resultado = await prepararItems(req.body.productos)
        if (resultado.status) {
            return res.status(resultado.status).json({ mensaje: resultado.mensaje })
        }

        const venta = await VentaModel.crearVenta({
            usuario_id: req.user.id,
            tipo_venta: 'web',
            estado: 'pendiente',
            total: resultado.total,
            items: resultado.items
        })

        return res.status(201).json({
            mensaje: 'Pedido registrado, abonalo en efectivo en la barbería',
            venta
        })
    }

    static async crearVentaMostrador(req, res) {
        const { usuario_id } = req.body

        if (usuario_id !== undefined) {
            const cliente = await UsuarioModel.perfilPorId(usuario_id)
            if (!cliente) {
                return res.status(400).json({ mensaje: 'El cliente no existe' })
            }
        }

        const resultado = await prepararItems(req.body.productos)
        if (resultado.status) {
            return res.status(resultado.status).json({ mensaje: resultado.mensaje })
        }

        const venta = await VentaModel.crearVenta({
            usuario_id: usuario_id ?? null,
            tipo_venta: 'mostrador',
            estado: 'completado',
            total: resultado.total,
            items: resultado.items
        })

        
        const ids = resultado.items.map(item => item.producto_id)
        const productosActualizados = await ProductoModel.productosPorIds(ids)
        const stockBajo = productosActualizados
            .filter(p => p.stock < STOCK_MINIMO)
            .map(p => ({ id_producto: p.id_producto, nombre: p.nombre, stock: p.stock }))

        return res.status(201).json({ mensaje: 'Venta registrada con éxito', venta, stockBajo })
    }

    static async misCompras(req, res) {
        const ventas = await VentaModel.listarPorUsuario(req.user.id)
        return res.status(200).json({ ventas })
    }

    static async verVenta(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensaje: 'El id no es un número válido' })
        }

        const venta = await VentaModel.ventaPorId(id)
        if (!venta || !puedeVerVenta(req.user, venta)) {
            return res.status(404).json({ mensaje: 'La venta no existe' })
        }

        return res.status(200).json({ venta })
    }

    static async cancelarVenta(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensaje: 'El id no es un número válido' })
        }

        const venta = await VentaModel.ventaPorId(id)
        if (!venta || !puedeVerVenta(req.user, venta)) {
            return res.status(404).json({ mensaje: 'La venta no existe' })
        }
        if (venta.estado !== 'pendiente') {
            return res.status(409).json({ mensaje: 'Solo se pueden cancelar ventas pendientes' })
        }

        const ventaCancelada = await VentaModel.cancelarVenta(id)
        return res.status(200).json({ mensaje: 'Venta cancelada con éxito', venta: ventaCancelada })
    }

    static async completarVenta(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensaje: 'El id no es un número válido' })
        }

        const venta = await VentaModel.ventaPorId(id)
        if (!venta) {
            return res.status(404).json({ mensaje: 'La venta no existe' })
        }
        if (venta.estado !== 'pendiente') {
            return res.status(409).json({ mensaje: 'Solo se pueden completar ventas pendientes' })
        }

        const ventaCompletada = await VentaModel.completarVenta(id)
        return res.status(200).json({ mensaje: 'Venta completada con éxito', venta: ventaCompletada })
    }

    static async listarVentas(req, res) {
        const { fecha, estado, tipo } = req.query
        const filtros = {}

        if (fecha !== undefined && fecha !== '') {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return res.status(400).json({ mensaje: 'La fecha debe tener el formato AAAA-MM-DD' })
            }
            const desde = new Date(`${fecha}T00:00:00${ZONA_HORARIA}`)
            if (Number.isNaN(desde.getTime())) {
                return res.status(400).json({ mensaje: 'La fecha no es válida' })
            }
            filtros.desde = desde
            filtros.hasta = new Date(desde.getTime() + 24 * 60 * 60 * 1000)
        }

        if (estado !== undefined && estado !== '') {
            if (!ESTADOS_VENTA.includes(estado)) {
                return res.status(400).json({ mensaje: 'El estado tiene que ser pendiente, completado o cancelado' })
            }
            filtros.estado = estado
        }

        if (tipo !== undefined && tipo !== '') {
            if (!TIPOS_VENTA.includes(tipo)) {
                return res.status(400).json({ mensaje: 'El tipo tiene que ser web o mostrador' })
            }
            filtros.tipo_venta = tipo
        }

        const ventas = await VentaModel.listarVentas(filtros)

        
        const totalCentavos = ventas
            .filter(v => v.estado === 'completado')
            .reduce((suma, v) => suma + Math.round(Number(v.total) * 100), 0)

        return res.status(200).json({ ventas, totalCobrado: totalCentavos / 100 })
    }
}