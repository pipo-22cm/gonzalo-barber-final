import prisma from '../config/db.js'

export class ServicioModel {
    
    static async listarTodosServicio(){
        return await prisma.servicios.findMany();
    }

    static async listarActivosServicio(){
        return await prisma.servicios.findMany({ 
            where : {estado: true} 
        });
    }

    static async buscarPorIdServicio(id){
        return await prisma.servicios.findUnique ({ where: {id_servicio: id} })
    }

    static async crearServicio(nuevoServicio){
        return await prisma.servicios.create ({
            data: {
                nombre: nuevoServicio.nombre,
                descripcion: nuevoServicio.descripcion,
                precio: nuevoServicio.precio,
                duracion: nuevoServicio.duracion
            }
        })
    }

    static async actualizarServicio(id, datos){
        return await prisma.servicios.update({
            where: {id_servicio: id},
            data: datos
        })
    }

    static async darDeBajaServicio(id){
        return await prisma.servicios.update({
            where: {id_servicio: id},
            data: { estado: false }
        })
    }

    static async reactivarServicio(id){
        return await prisma.servicios.update({
            where: {id_servicio: id},
            data: { estado: true }
        })
    }
}




