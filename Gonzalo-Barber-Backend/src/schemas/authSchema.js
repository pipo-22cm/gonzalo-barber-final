import { z } from 'zod';
z.config(z.locales.es());

export const registroSchema = z.object({
  nombre: z.string().trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),

  apellido: z.string().trim()
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no puede superar los 100 caracteres'),

  email: z.email('El email no tiene un formato válido')
    .max(100, 'El email no puede superar los 100 caracteres'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede superar los 72 caracteres'),

  telefono: z.string().trim()
    .regex(/^\d{8,15}$/, 'El teléfono solo puede tener números, entre 8 y 15 dígitos')
    .optional()
});

export const loginSchema = z.object({
    email: z.email('El formato de email no es valido') ,
    
    password: z.string()
    .min(1, "La contraseña es obligatoria")
})