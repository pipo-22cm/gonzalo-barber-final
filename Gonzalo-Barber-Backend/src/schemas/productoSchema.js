import { z } from 'zod'
z.config(z.locales.es())

export const crearProductoSchema = z.object({
    categoria_id: z.number('La categoría es obligatoria')
        .int('La categoría debe ser un número entero')
        .positive('La categoría no es válida'),

    nombre: z.string('El nombre es obligatorio').trim()
        .min(1, 'El nombre es obligatorio')
        .max(100, 'El nombre no puede superar los 100 caracteres'),

    descripcion: z.string('La descripción debe ser un texto').trim()
        .max(255, 'La descripción no puede superar los 255 caracteres')
        .optional(),

    precio: z.number('El precio es obligatorio')
        .positive('El precio tiene que ser mayor a 0'),

    stock: z.number('El stock es obligatorio')
        .int('El stock debe ser un número entero')
        .nonnegative('El stock no puede ser negativo'),

    imagen_url: z.string('La imagen debe ser un texto').trim()
        .max(255, 'La URL de la imagen no puede superar los 255 caracteres')
        .optional()
})

export const actualizarProductoSchema = crearProductoSchema.partial()