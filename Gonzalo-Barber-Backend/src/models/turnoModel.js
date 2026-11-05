import prisma  from '../config/db.js';

export class TurnoModel {

    static async buscarPorIdTurno(id) {
        //Un turno, con su servicio
        return await prisma.turnos.findUnique ({
            where: {id_turno: id},
            include: {servicios: true}
        })
    }

    static async listarPorUsuario(usuarioId) {
        //Los turnos de un cliente, con su servicio
        return await prisma.turnos.findMany ({
            where: {usuario_id: usuarioId },
            include: {servicios: true},
            orderBy: {fecha_hora: 'desc'}
        })
    }

    static async listarPorFecha(inicio, fin) {
        //Todos los turnos de un día, con servicio y cliente
        //Panel del admin (RF-4)
        return await prisma.turnos.findMany ({
            where: { fecha_hora:{ gte: inicio, lt: fin } },
            orderBy: {fecha_hora: 'asc'},
            include: {
                servicios: true,
                usuarios: { select: {nombre: true, apellido:true, telefono:true } }
            }
        })

    }

    static async listarActivosPorFecha(inicio, fin) {
        //Solo los pendientes y confirmados de un día, con la duración del servicio
        return await prisma.turnos.findMany({
            where:{
                fecha_hora:{gte: inicio, lt:fin},
                estado: {in: ['pendiente', 'confirmado']}
            },
            include: {
                servicios: { select: { duracion: true} }
            }
        })
    }

    static async crearTurno(nuevoTurno) {
        //Inserta un turno nuevo
        return await prisma.turnos.create({
            data:{
                usuario_id: nuevoTurno.usuario_id,
                servicio_id: nuevoTurno.servicio_id,
                fecha_hora: nuevoTurno.fecha_hora
            }
        })
    }

    static async actualizarTurno(id,datos) {
        //Cambia fecha, hora o servicio
        return await prisma.turnos.update({
            where: {id_turno: id},
            data: datos
        })
    }

    static async cambiarEstadoTurno(id, estado) {
        //Cambia el estado
        //Cancelar o confirmar
        return await prisma.turnos.update({
            where: {id_turno: id},
            data: {estado: estado}
        })
    }

    static async completarTurno(id, usuarioId, puntos)	{
        //Estado a completado + 10 puntos (transacción)
        return await prisma.$transaction([
            prisma.turnos.update({
                where: {id_turno: id},
                data: {estado: 'completado'}
            }),
            prisma.usuarios.update({
                where: {id_usuario: usuarioId},
                data: {puntos: {increment: puntos} }
            })
        ])
        
    }
    
}