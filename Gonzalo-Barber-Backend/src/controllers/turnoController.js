import { TurnoModel } from '../models/turnoModel.js';
import { ServicioModel } from '../models/servicioModel.js';
import { BloqueoModel } from '../models/bloqueoModel.js';
import {DIAS_ATENCION, FRANJAS_HORARIAS, DURACION_BLOQUE, HORAS_LIMITE_CANCELAR, PUNTOS_POR_TURNO, ZONA_HORARIA} from '../config/negocio.js';
import { seSuperpone } from '../utils/horarios.js'


    async function validarHorario(servicio, fecha, hora, idTurnoExcluido) {
            // Armar la fecha del turno, en hora de Argentina
            const inicio = new Date(`${fecha}T${hora}:00${ZONA_HORARIA}`);
            if (Number.isNaN(inicio.getTime())) {
                return { status: 400, mensaje: 'La fecha u hora no es válida' };
            }

            // ¿Es una fecha futura?
            if (inicio <= new Date()) {
                return { status: 400, mensaje: 'No se puede reservar un turno en una fecha u hora pasada' };
            }

            // ¿Es martes a sábado? (RF-25)
            const dia = new Date(`${fecha}T00:00:00Z`).getUTCDay();
            if (!DIAS_ATENCION.includes(dia)) {
                return { status: 400, mensaje: 'Solo se pueden reservar turnos de martes a sábado' };
            }

            // ¿Empieza en un bloque de 30 minutos?
            const [h, m] = hora.split(':').map(Number);
            const minutosInicio = h * 60 + m;
            if (minutosInicio % DURACION_BLOQUE !== 0) {
                return { status: 400, mensaje: 'Los turnos empiezan cada 30 minutos' };
            }

            // ¿El servicio entra entero en una franja horaria? (RF-25)
            const bloques = Math.ceil(servicio.duracion / DURACION_BLOQUE);
            const minutosFin = minutosInicio + bloques * DURACION_BLOQUE;
            const entraEnFranja = FRANJAS_HORARIAS.some(franja =>
                minutosInicio >= franja.inicio && minutosFin <= franja.fin
            );
            if (!entraEnFranja) {
                return { status: 400, mensaje: 'El servicio no entra en el horario de atención' };
            }

            // ¿Se superpone con otro turno activo?
            const fin = new Date(inicio.getTime() + bloques * DURACION_BLOQUE * 60 * 1000);
            const bloqueos = await BloqueoModel.listarPorRango(inicio, fin);
                    if (bloqueos.length > 0) {
                        return { status: 409, mensaje: 'La barbería no atiende en ese horario' };
                    }
            const inicioDia = new Date(`${fecha}T00:00:00${ZONA_HORARIA}`);
            const finDia = new Date(inicioDia.getTime() + 24 * 60 * 60 * 1000);
            const turnosDelDia = await TurnoModel.listarActivosPorFecha(inicioDia, finDia);

            if (seSuperpone(inicio, fin, turnosDelDia, idTurnoExcluido)) {
                return { status: 409, mensaje: 'Ese horario ya está ocupado, por favor elegí otro' };
            }

            return { inicio };
        }
    
   
        // ¿El horario de inicio a fin choca con algún turno activo? (RF-2)
// Saltea el turno idTurnoExcluido (el que se está modificando), si hay uno.

export class TurnoController {
    

static async disponibilidad(req, res) {
    try {
        // 1. Leer y validar los datos del query string
        const { fecha } = req.query;
        const servicioId = Number(req.query.servicio_id);

        if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({ mensaje: 'La fecha debe tener el formato AAAA-MM-DD' });
        }
        if (!Number.isInteger(servicioId)) {
            return res.status(400).json({ mensaje: 'El servicio no es válido' });
        }
        const inicioDia = new Date(`${fecha}T00:00:00${ZONA_HORARIA}`);
        if (Number.isNaN(inicioDia.getTime())) {
            return res.status(400).json({ mensaje: 'La fecha no es válida' });
        }

        // 2. ¿El servicio existe y está activo?
        const servicio = await ServicioModel.buscarPorIdServicio(servicioId);
        if (!servicio || !servicio.estado) {
            return res.status(404).json({ mensaje: 'El servicio no está disponible' });
        }

        // 3. ¿Es un día de atención? Si no, no hay horarios
        const dia = new Date(`${fecha}T00:00:00Z`).getUTCDay();
        if (!DIAS_ATENCION.includes(dia)) {
            return res.status(200).json({ fecha, servicio_id: servicioId, horarios: [] });
        }

        // 4. ¿Cuánto ocupa el servicio?
        const bloques = Math.ceil(servicio.duracion / DURACION_BLOQUE);
        const duracionMs = bloques * DURACION_BLOQUE * 60 * 1000;

        // 5. Los turnos activos del día, en UNA sola consulta
        const finDia = new Date(inicioDia.getTime() + 24 * 60 * 60 * 1000);
        const turnosDelDia = await TurnoModel.listarActivosPorFecha(inicioDia, finDia);
        const bloqueosDelDia = await BloqueoModel.listarPorRango(inicioDia, finDia);

        // 6. Recorrer todos los horarios posibles de cada franja
        const ahora = new Date();
        const horarios = [];

        for (const franja of FRANJAS_HORARIAS) {
            for (let minutos = franja.inicio; minutos + bloques * DURACION_BLOQUE <= franja.fin; minutos += DURACION_BLOQUE) {
                // Pasar los minutos a "HH:MM"
                const hh = String(Math.floor(minutos / 60)).padStart(2, '0');
                const mm = String(minutos % 60).padStart(2, '0');
                const hora = `${hh}:${mm}`;

                const inicio = new Date(`${fecha}T${hora}:00${ZONA_HORARIA}`);
                const fin = new Date(inicio.getTime() + duracionMs);

                if (inicio <= ahora) continue;                                // ya pasó
                if (seSuperpone(inicio, fin, turnosDelDia, null)) continue;   // está ocupado
                const estaBloqueado = bloqueosDelDia.some(b =>
                    inicio < b.fecha_hora_fin && fin > b.fecha_hora_inicio
                );
                if (estaBloqueado) continue; 
                horarios.push(hora);
            }
        }

        // 7. Responder la lista
        return res.status(200).json({ fecha, servicio_id: servicioId, horarios });

    } catch (error) {
        console.error('Error al consultar la disponibilidad:', error);
        return res.status(500).json({
            mensaje: 'Error al consultar la disponibilidad, por favor intente más tarde.'
        });
    }
}

    static async crearTurno (req, res){
        try{
            //Datos: el usuario sale del token; el resto, del body (ya validado por Zod)
            const idUsuario = req.user.id
            const { servicio_id,fecha, hora } = req.body
            //¿El servicio existe y está activo?
            const servicio = await ServicioModel.buscarPorIdServicio(servicio_id)
            if (!servicio || !servicio.estado){
                return res.status(404).json({mensaje:'El servicio no esta disponible'})
            }
            // Validar fecha, hora, franja y superposicion
            const resultado = await validarHorario(servicio, fecha, hora, null);
                if (resultado.status) {
                    return res.status(resultado.status).json({ mensaje: resultado.mensaje });
                }

            const turno = await TurnoModel.crearTurno({
                usuario_id: idUsuario,
                servicio_id,
                fecha_hora: resultado.inicio
            });

            return res.status(201).json({ mensaje: 'Turno reservado con éxito', turno });

            
        }catch(error){
            console.error('Error al crear el turno:', error);
            return res.status(500).json({
                mensaje: 'Error al reservar el turno, por favor intente más tarde.'
            });
        }
    }

    static async misTurnos (req, res){
        try{
            const idUsuario = req.user.id
            const turnos = await TurnoModel.listarPorUsuario(idUsuario)
            return res.status(200).json({turnos: turnos})
        }catch(error){
            console.error('Error al traer los turnos:', error);
            return res.status(500).json({ 
                mensaje: 'Error al traer los turnos, por favor intente mas tarde.'
             })
        }
    }

    static async cancelarMiTurno (req, res){
        try{
            const id = Number(req.params.id)
            if (!Number.isInteger(id)){
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }

            const turno = await TurnoModel.buscarPorIdTurno(id)
            if(!turno){
                return res.status(404).json({mensaje: 'El turno no existe'})
            }

            const idUsuario = req.user.id
            if(turno.usuario_id !== idUsuario){
                return res.status(404).json({mensaje: 'El turno no existe'})
            }

            if(turno.estado !== "pendiente" && turno.estado !== "confirmado"  ){
                return res.status(409).json({ mensaje: "El turno no se encuentra en un estado activo para cancelar" });
            }

            const faltan = turno.fecha_hora.getTime() - Date.now();
            const limite = HORAS_LIMITE_CANCELAR * 60 * 60 * 1000;
        
            if (faltan < limite){
                return res.status(400).json({ mensaje: `Solo se puede cancelar hasta ${HORAS_LIMITE_CANCELAR} horas antes del turno` });
            }

            const turnoCancelado = await TurnoModel.cambiarEstadoTurno(id,'cancelado')
                return res.status(200).json({mensaje: 'Turno cancelado con éxito', turno: turnoCancelado})

        }catch(error){
            console.error('Error al cancelar el turno:', error);
            return res.status(500).json({
                mensaje: 'Error al cancelar el turno, por favor intente más tarde.'
            });
        }
    }

    static async listarPorFecha (req, res){
        try{
            const fecha = req.query.fecha
            const inicio = new Date(`${fecha}T00:00:00${ZONA_HORARIA}`);
            if (Number.isNaN(inicio.getTime())){
                return res.status(400).json({ mensaje: "Formato de fecha inválido." });
            }
            const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
            const listarXFecha = await TurnoModel.listarPorFecha(inicio, fin);
            return res.status(200).json({turnos: listarXFecha})

        }catch(error){
            console.error('Error al listar por fecha :', error);
            return res.status(500).json({ 
                mensaje: 'Error al listar por fecha, por favor intente mas tarde.'
             })
        }
    }

    static async actualizarTurno (req, res){
        try{
            const id = Number(req.params.id)
            const { fecha, hora } = req.body
                if(!Number.isInteger(id)){
                    return res.status(400).json({ mensaje: 'El id no es un número válido' });
                }

            const turno = await TurnoModel.buscarPorIdTurno(id)
                if(!turno){
                    return res.status(404).json({mensaje: 'El turno no existe'})
                }

                if(turno.estado !== "pendiente" && turno.estado !== "confirmado"  ){
                    return res.status(409).json({ mensaje: "El turno no se encuentra en un estado activo para cancelar" });
                }

            const servicio = req.body.servicio_id 
                        ? await ServicioModel.buscarPorIdServicio(req.body.servicio_id)
                        : turno.servicios;

                if (req.body.servicio_id && (!servicio || !servicio.estado)) {
                    return res.status(404).json({ mensaje: 'El servicio no está disponible' });
                }

            const resultado = await validarHorario(servicio, fecha, hora, id);
                if (resultado.status) {
                    return res.status(resultado.status).json({ mensaje: resultado.mensaje });
                }

            const turnoActualizado = await TurnoModel.actualizarTurno (id, { servicio_id: servicio.id_servicio, fecha_hora: resultado.inicio })
            return res.status(200).json({ mensaje: 'Turno actualizado con éxito', turno: turnoActualizado });
    

        }catch(error){
                console.error('Error al actualizar el turno:', error);
            return res.status(500).json({
                mensaje: 'Error al actualizar el turno, por favor intente más tarde.'
            });
        }
    }

    static async cambiarEstado (req, res){
        try{
            const id = Number(req.params.id)
            if(!Number.isInteger(id)){
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }

            const turno = await TurnoModel.buscarPorIdTurno(id)
            if(!turno){
                return res.status(404).json({mensaje: 'El turno no existe'})
            }

            if(turno.estado !== "pendiente" && turno.estado !== "confirmado" ){
                return res.status(409).json({mensaje: 'El turno no esta activo.' })
            }

            const {estado} = req.body
            if(turno.estado === estado){
                return res.status(409).json({mensaje: `El turno ya está ${estado}` })
            }

            const turnoActualizado = await TurnoModel.cambiarEstadoTurno(id, estado);
            return res.status(200).json({ mensaje: 'Estado del turno actualizado', turno: turnoActualizado });


        }catch(error){
            console.error('Error al cambiar el estado del turno:', error);
            return res.status(500).json({
                mensaje: 'Error al cambiar el estado del turno, por favor intente más tarde.'
            });
        }
    }

    static async completarTurno (req, res){
        try{
            const id = Number(req.params.id)
            if(!Number.isInteger(id)){
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }
            const turno = await TurnoModel.buscarPorIdTurno(id)
            if(!turno){
                return res.status(404).json({mensaje: 'El turno no existe'})
            }
            if (turno.fecha_hora > new Date()) {
                return res.status(400).json({ mensaje: 'No se puede completar un turno que todavía no empezó' });
            }
            if(turno.estado !== "pendiente" && turno.estado !== "confirmado" ){
                return res.status(409).json({mensaje: 'El turno no esta activo.' })
            }

            const sumaPuntos = await TurnoModel.completarTurno(id,turno.usuario_id,PUNTOS_POR_TURNO);
             return res.status(200).json({mensaje:`Turno completado, se sumaron ${PUNTOS_POR_TURNO} puntos al cliente`});

        }catch(error){
            console.error('Error al completar y sumar puntos :', error);
            return res.status(500).json({ 
                mensaje: 'Error al completar y sumar puntos, por favor intente mas tarde.'
             })
        }
    }

    
}