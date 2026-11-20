import { z } from 'zod'
z.config(z.locales.es())

export const registroSchema = z.object({
    nombre: z.string('El nombre es obligatorio').trim()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'El nombre no puede superar los 100 caracteres'),

    apellido: z.string('El apellido es obligatorio').trim()
        .min(1, 'El apellido es obligatorio')
        .max(100, 'El apellido no puede superar los 100 caracteres'),

    email: z.string('El email es obligatorio').trim().toLowerCase()
        .max(100, 'El email no puede superar los 100 caracteres')
        .email('El email no es válido'),

    password: z.string('La contraseña es obligatoria')
        .min(8, 'La contraseña tiene que tener al menos 8 caracteres')
        .max(72, 'La contraseña no puede superar los 72 caracteres'),

    telefono: z.string('El teléfono debe ser un texto').trim()
        .regex(/^\d{8,15}$/, 'El teléfono solo puede tener números, entre 8 y 15 dígitos')
        .optional()
})

export const loginSchema = z.object({
    email: z.string('El email es obligatorio').trim().toLowerCase()
        .email('El email no es válido'),

    password: z.string('La contraseña es obligatoria')
        .min(1, 'La contraseña es obligatoria')
})

export const olvidePasswordSchema = loginSchema.pick({ email: true })

export const restablecerPasswordSchema = registroSchema
  .pick({ password: true })
  .extend({
    token: z.string('El enlace no es válido').regex(/^[a-f0-9]{64}$/, 'El enlace no es válido')
  })