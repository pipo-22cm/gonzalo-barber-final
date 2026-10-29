import { TurnoModel } from '../models/turnoModel.js'

export class TurnoController {

    static async crearTurno (req,res) {
        try {

            console.log("BODY:", req.body);
            console.log("USER:", req.user);
            const { servicio_id, fecha_hora } = req.body
            const usuario_id = req.user.id;

            const datosTurnos =  await TurnoModel.crearTurno(
                usuario_id,
                servicio_id,
                fecha_hora
            ) 

            res.status(201).json({mensaje: 'Turno craeado con éxito'})

        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

}