import { z } from 'zod'
z.config(z.locales.es())

export const crearServicioSchema = z.object({
    nombre: z.string('El nombre es obligatorio').trim()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'El nombre no puede superar los 100 caracteres'),

    descripcion: z.string('La descripción debe ser un texto').trim()
        .max(255, 'La descripción no puede superar los 255 caracteres')
        .optional(),

    precio: z.number('El precio es obligatorio')
        .positive('El precio tiene que ser mayor a 0')
        .max(99999999.99, 'El precio no puede superar los $99.999.999,99'),

    duracion: z.number('La duración es obligatoria')
        .int('La duración debe ser un número entero')
        .positive('La duración tiene que ser mayor a 0')
});

export const actualizarServicioSchema = crearServicioSchema.partial();
