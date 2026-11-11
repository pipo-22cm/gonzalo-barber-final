import { z } from 'zod';
z.config(z.locales.es());

export const categoriaSchema = z.object({
    nombre:.string('El nombre es obligatorio').trim()
        .min(1,'El nombre tiene que ser maximo a 1 caracter')
        .max(100,'El nombre no puede tener más de 100 caracteres'),
})  





