import { z } from 'zod';
z.config(z.locales.es());


export const crearServicioSchema = z.object ({
    nombre: z.string('El nombre es obligatorio').trim()
    .min(1,"El nombre tiene que ser obligatorio")
    .max(100,"El nombre no puede superar los 100 caracteres"),

    descripcion: z.string().trim()
    .max(255,"La descripcion no puede superar los 255 caracteres")
    .optional(),

    precio: z.number('El precio es obligatorio')
    .positive('El precio tiene que ser mayor a 0')
    .max(99999999.99,'El precio no puede superar los $99.999.999,99'),

    duracion: z.number('La duración es obligatoria').positive('La duración tiene que ser mayor a 0').int('La duración tiene que ser un número entero de minutos'),

});

export const actualizarServicioSchema = crearServicioSchema.partial();

