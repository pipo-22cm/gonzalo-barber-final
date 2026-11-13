import prisma from '../config/db.js'

export class ProductoModel {
    static async listarProductos({ nombre, categoria_id, soloActivos } = {}) {
    const where = {}

    if (soloActivos) {
        where.estado = true
    }

    if (nombre) {
        where.nombre = { contains: nombre }
    }

    if (categoria_id) {
        where.categoria_id = categoria_id
    }

    return await prisma.productos.findMany({
        where,
        include: { categorias: true },
        orderBy: { nombre: 'asc' }
    })
    }

    static async productoPorId(id) {
    return await prisma.productos.findUnique({
        where: { id_producto: id },
        include: { categorias: true }
    })
    }

    static async crearProducto(datos) {
    return await prisma.productos.create({
        data: datos
    })
    }

    static async actualizarProducto(id, datos) {
    return await prisma.productos.update({
        where: { id_producto: id },
        data: datos
    })
    }

    static async reactivarProducto(id) {
    return await prisma.productos.update({
        where: { id_producto: id },
        data: { estado: true }
    })
}

    static async darDeBajaProducto(id) {
    return await prisma.productos.update({
        where: { id_producto: id },
        data: { estado: false }
    })
    }   
}