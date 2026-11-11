import { DURACION_BLOQUE } from '../config/negocio.js';

export function seSuperpone(inicio, fin, turnosDelDia, idTurnoExcluido) {
    return turnosDelDia.some(t => {
        if (t.id_turno === idTurnoExcluido) return false;
        const tBloques = Math.ceil(t.servicios.duracion / DURACION_BLOQUE);
        const tFin = new Date(t.fecha_hora.getTime() + tBloques * DURACION_BLOQUE * 60 * 1000);
        return inicio < tFin && fin > t.fecha_hora;
    });
}
