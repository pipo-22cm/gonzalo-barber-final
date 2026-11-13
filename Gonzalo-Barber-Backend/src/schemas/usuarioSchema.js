import { z } from 'zod'
import { registroSchema } from './authSchema.js'

export const actualizarPerfilSchema = registroSchema
    .pick({ nombre: true, apellido: true, telefono: true })
    .extend({
        telefono: z.string('El teléfono debe ser un texto').trim()
            .regex(/^\d{8,15}$/, 'El teléfono solo puede tener números, entre 8 y 15 dígitos')
    })
    .partial()