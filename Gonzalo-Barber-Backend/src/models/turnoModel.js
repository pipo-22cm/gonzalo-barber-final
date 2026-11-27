import prisma  from '../config/db.js';

export class TurnoModel {

    static async buscarPorIdTurno(id) {
        return await prisma.turnos.findUnique ({
            where: {id_turno: id},
            include: {servicios: true}
        })
    }

    static async listarPorUsuario(usuarioId) {
        return await prisma.turnos.findMany ({
            where: {usuario_id: usuarioId },
            include: {servicios: true},
            orderBy: {fecha_hora: 'desc'}
        })
    }

    static async listarPorFecha(inicio, fin) {
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
        return await prisma.turnos.create({
            data:{
                usuario_id: nuevoTurno.usuario_id,
                servicio_id: nuevoTurno.servicio_id,
                fecha_hora: nuevoTurno.fecha_hora
            }
        })
    }

    static async actualizarTurno(id,datos) {
        return await prisma.turnos.update({
            where: {id_turno: id},
            data: datos
        })
    }

    static async cambiarEstadoTurno(id, estado) {
        return await prisma.turnos.update({
            where: {id_turno: id},
            data: {estado: estado}
        })
    }

    static async completarTurno(id, usuarioId, puntos)	{
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
    
    static async listarSinCompletar() {
      return prisma.turnos.findMany({
        where: {
          estado: { in: ['pendiente', 'confirmado'] },
          fecha_hora: { lt: new Date() },
        },
        include: {
          servicios: true,
          usuarios: {
            select: { id_usuario: true, nombre: true, apellido: true, telefono: true }, // nunca la contraseña
          },
        },
        orderBy: { fecha_hora: 'asc' }, 
      });
    }
}