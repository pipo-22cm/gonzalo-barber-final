import prisma  from '../config/db.js';

export class BloqueoModel {

    static async listarDesde (desde){
        return await prisma.bloqueos.findMany({
            where: { fecha_hora_fin: {gte: desde} },
            orderBy: { fecha_hora_inicio: 'asc'}
        });
    }

    static async buscarPorIdBloqueo(id){
        return await prisma.bloqueos.findUnique({
            where: {id_bloqueo: id}
        })
    }

    static async listarPorRango(inicio,fin){
        return await prisma.bloqueos.findMany({
            where: {
                fecha_hora_inicio: { lt: fin },    
                fecha_hora_fin:    { gt: inicio }   
            }
        })
    }

    static async crearBloqueo(nuevoBloqueo){
        return await prisma.bloqueos.create({
            data: {
                fecha_hora_inicio: nuevoBloqueo.fecha_hora_inicio,
                fecha_hora_fin: nuevoBloqueo.fecha_hora_fin,
                motivo:nuevoBloqueo.motivo
            }
        })
    }

    static async eliminarBloqueo(id){
        return await prisma.bloqueos.delete({
            where: {id_bloqueo: id}
        })
    }

}