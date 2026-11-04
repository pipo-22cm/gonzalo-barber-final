import { z } from 'zod';
z.config(z.locales.es());


export const crearServicioSchema = z.object ({
    nombre: z.string().trim()
    .min(1,"El nombre tiene que ser obligatorio")
    .max(100,"El nombre no puede superar los 100 caracteres"),

    descripcion: z.string().trim()
    .max(255,"La descripcion no puede superar los 255 caracteres")
    .optional(),

    precio: z.number()
    .positive('El precio tiene que ser mayor a 0')
    .max(99999999.99,'El precio no puede superar los $99.999.999,99'),

    duracion: z.number().positive().int(),

    estado:z.boolean()
    .optional()

});

export const actualizarServicioSchema = crearServicioSchema.partial();

