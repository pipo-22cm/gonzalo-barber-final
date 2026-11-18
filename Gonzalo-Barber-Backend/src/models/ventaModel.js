import prisma from '../config/db.js'


const incluirDetalle = {
    detalle_ventas: {
        include: {
            productos: { select: { id_producto: true, nombre: true } }
        }
    },
    usuarios: {
        select: { id_usuario: true, nombre: true, apellido: true, email: true }
    }
}

function errorSinStock() {
    const error = new Error('Uno de los productos ya no tiene stock suficiente, revisá el carrito')
    error.status = 409
    return error
}

export class VentaModel {

    static async crearVenta({ usuario_id, tipo_venta, estado, total, items }) {
        return await prisma.$transaction(async (tx) => {

            for (const item of items) {
                const { count } = await tx.productos.updateMany({
                    where: {
                        id_producto: item.producto_id,
                        stock: { gte: item.cantidad }
                    },
                    data: { stock: { decrement: item.cantidad } }
                })
                if (count === 0) throw errorSinStock()
            }

            return await tx.ventas.create({
                data: {
                    usuario_id,
                    tipo_venta,
                    estado,
                    total,
                    detalle_ventas: {
                        create: items.map(item => ({
                            producto_id: item.producto_id,
                            cantidad: item.cantidad,
                            precio_unitario: item.precio_unitario
                        }))
                    }
                },
                include: incluirDetalle
            })
        })
    }

    static async cancelarVenta(id) {
        return await prisma.$transaction(async (tx) => {

            const { count } = await tx.ventas.updateMany({
                where: { id_venta: id, estado: 'pendiente' },
                data: { estado: 'cancelado' }
            })
            if (count === 0) {
                const error = new Error('La venta ya no está pendiente')
                error.status = 409
                throw error
            }


            const detalle = await tx.detalle_ventas.findMany({ where: { venta_id: id } })
            for (const renglon of detalle) {
                await tx.productos.update({
                    where: { id_producto: renglon.producto_id },
                    data: { stock: { increment: renglon.cantidad } }
                })
            }

            return await tx.ventas.findUnique({
                where: { id_venta: id },
                include: incluirDetalle
            })
        })
    }

    static async completarVenta(id) {
        return await prisma.ventas.update({
            where: { id_venta: id },
            data: { estado: 'completado' },
            include: incluirDetalle
        })
    }

    static async ventaPorId(id) {
        return await prisma.ventas.findUnique({
            where: { id_venta: id },
            include: incluirDetalle
        })
    }

    static async listarPorUsuario(usuarioId) {
        return await prisma.ventas.findMany({
            where: { usuario_id: usuarioId },
            orderBy: { created_at: 'desc' },
            include: incluirDetalle
        })
    }

    static async listarVentas({ desde, hasta, estado, tipo_venta } = {}) {
        const where = {}
        if (desde && hasta) where.created_at = { gte: desde, lt: hasta }
        if (estado) where.estado = estado
        if (tipo_venta) where.tipo_venta = tipo_venta

        return await prisma.ventas.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: incluirDetalle
        })
    }
}