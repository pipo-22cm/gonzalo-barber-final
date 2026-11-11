import prisma from '../config/db.js'

export class CategoriaModel {
    
    static async todasLasCategorias(){
        return await prisma.categorias.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    static async categoriaPorId(id){
        return await prisma.categorias.findUnique({
            where:{id_categoria: id}
        })
    }

    static async categoriaPorNombre(nombre) {
        return await prisma.categorias.findUnique({
            where: { nombre: nombre }
        })
    }

    static async crearCategoria(categoriaNueva){
        return await prisma.categorias.create({
            data:{
                nombre: categoriaNueva.nombre
            }
        })
    }

    static async actualizarCategoria(id, datos){
        return await prisma.categorias.update({
            where: {id_categoria: id},
            data: datos
        })
    }

    static async eliminarCategoria(id){
        return await prisma.categorias.delete({
            where: {id_categoria: id}
        })
    }

    static async contarProductos(id) {
        return await prisma.productos.count({
            where: { categoria_id: id }
        })
    }
}

