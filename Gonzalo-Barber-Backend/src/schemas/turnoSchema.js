import { z } from 'zod';
z.config(z.locales.es());


export const crearTurnoSchema = z.object({
    servicio_id: z.number().positive().int(),

    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'La fecha debe tener el formato AAAA-MM-DD'),

    hora: z.string().regex(/^\d{2}:\d{2}$/,'La hora debe tener el formato HH:MM')
})