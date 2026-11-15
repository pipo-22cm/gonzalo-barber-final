import { z } from 'zod'
z.config(z.locales.es())

const descripcion = z.string('La descripción tiene que ser un texto').trim()
    .max(255, 'La descripción no puede superar los 255 caracteres')

export const subirImagenSchema = z.object({
    descripcion: descripcion.optional()
})

export const editarDescripcionSchema = z.object({
    descripcion
})