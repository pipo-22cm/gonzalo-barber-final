import { z } from 'zod';
z.config(z.locales.es());


export const crearBloqueoSchema = z.object ({
    fecha:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'La fecha debe tener el formato AAAA-MM-DD'),

    hora_inicio:z.string().regex(/^\d{2}:\d{2}$/,'La hora debe tener el formato HH:MM')
    .optional(),

    hora_fin:z.string().regex(/^\d{2}:\d{2}$/,'La hora debe tener el formato HH:MM')
    .optional(),

    motivo:z.string().trim().max(255,'El motivo no puede contener mas de 255 caracteres')
    .optional()
}).refine(
    datos =>(datos.hora_inicio === undefined) === (datos.hora_fin === undefined),
    'Indicá la hora de inicio y la de fin, o ninguna para bloquear el día completo'
)