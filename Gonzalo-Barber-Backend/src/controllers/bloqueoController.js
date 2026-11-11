import { BloqueoModel } from '../models/bloqueoModel.js';
import { TurnoModel } from '../models/turnoModel.js';
import { DIAS_ATENCION, FRANJAS_HORARIAS, HORAS_LIMITE_CANCELAR, PUNTOS_POR_TURNO, ZONA_HORARIA } from '../config/negocio.js';
import { seSuperpone } from '../utils/horarios.js'


export class BloqueoController {

    static async listarBloqueos (req,res){
        try {
        const bloqueos = await BloqueoModel.listarDesde(new Date());
        return res.status(200).json({ bloqueos });
        }catch(error){
        console.error('Error al listar el bloqueo:', error);
            return res.status(500).json({
            mensaje: 'Error al listar el bloqueo, por favor intente más tarde.'
        });
        }  
    }

    static async crearBloqueo (req,res){
        try{
        const { fecha, hora_inicio, hora_fin, motivo } = req.body
        const horaInicio = hora_inicio ?? '09:00'
        const horaFin = hora_fin ?? '21:00'

        const inicio = new Date(`${fecha}T${horaInicio}:00${ZONA_HORARIA}`)
        const fin = new Date(`${fecha}T${horaFin}:00${ZONA_HORARIA}`);

        if(Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())){
            return res.status(400).json({mensaje: 'La fecha u hora no es válida'});
        }

        if (fin <= inicio) {
            return res.status(400).json({ mensaje: 'La hora de fin tiene que ser posterior a la de inicio' });
        }

        if (fin <= new Date()){
            return res.status(400).json({mensaje: 'El bloqueo ya termino'})
        }

        const inicioDia = new Date(`${fecha}T00:00:00${ZONA_HORARIA}`);
        const finDia = new Date(inicioDia.getTime() + 24 * 60 * 60 * 1000);
        const turnosDelDia = await TurnoModel.listarActivosPorFecha(inicioDia, finDia)

        if (seSuperpone(inicio, fin, turnosDelDia, null)){
            return res.status(409).json({ mensaje: 'Hay turnos activos en ese horario, cancelalos antes de bloquearlo' });
        }

        const bloqueo = await BloqueoModel.crearBloqueo({
            fecha_hora_inicio: inicio,
            fecha_hora_fin: fin,
            motivo
        });

        return res.status(201).json({ mensaje: 'Bloqueo creado con éxito', bloqueo });

        }catch(error){
            console.error('Error al crear el bloqueo:', error);
            return res.status(500).json({
            mensaje: 'Error al crear el bloqueo, por favor intente más tarde.'
        }); 
        }



    }

    static async eliminarBloqueo (req,res){
        try{
        const id = Number(req.params.id)
        if(!Number.isInteger(id)){
            return res.status(400).json({ mensaje: 'El id no es un número válido' });
        }

        const bloqueo = await BloqueoModel.buscarPorIdBloqueo(id)
        if(!bloqueo){
            return res.status(404).json({ mensaje: 'El bloqueo no existe' });
        } 

        const bloqueEliminado = await BloqueoModel.eliminarBloqueo(id);
        return res.status(200).json({ mensaje: 'Bloqueo eliminado con exito', bloqueEliminado});
        }catch(error){
        console.error('Error al eliminar el bloqueo:', error);
            return res.status(500).json({
            mensaje: 'Error al eliminar el bloqueo, por favor intente más tarde.'
        });
        }
    
    }

}

