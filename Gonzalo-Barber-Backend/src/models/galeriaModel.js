import prisma from '../config/db.js'

export class GaleriaModel {

    static async listarImagenes() {
        return await prisma.galeria.findMany({
            orderBy: { created_at: 'desc' }
        })
    }

    static async imagenPorId(id) {
        return await prisma.galeria.findUnique({
            where: { id_imagen: id }
        })
    }

    static async crearImagen(datos) {
        return await prisma.galeria.create({
            data: datos
        })
    }

    static async actualizarDescripcion(id, descripcion) {
        return await prisma.galeria.update({
            where: { id_imagen: id },
            data: { descripcion }
        })
    }

    static async eliminarImagen(id) {
        return await prisma.galeria.delete({
            where: { id_imagen: id }
        })
    }
}