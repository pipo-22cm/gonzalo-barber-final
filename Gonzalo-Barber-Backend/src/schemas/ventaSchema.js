import { z } from 'zod';
z.config(z.locales.es());


const itemVenta = z.object({
    producto_id: z.number('El producto es obligatorio')
        .int('El producto no es válido')
        .positive('El producto no es válido'),

    cantidad: z.number('La cantidad es obligatoria')
        .int('La cantidad debe ser un número entero')
        .min(1, 'La cantidad mínima es 1')
})

export const crearVentaSchema = z.object({
    productos: z.array(itemVenta, 'Los productos tienen que venir en una lista')
        .min(1, 'Tenés que agregar al menos un producto')
        .refine(
            (productos) => new Set(productos.map(p => p.producto_id)).size === productos.length,
            'Un mismo producto no puede venir dos veces: sumá la cantidad'
        )
})

export const ventaMostradorSchema = crearVentaSchema.extend({
    usuario_id: z.number('El cliente no es válido')
        .int('El cliente no es válido')
        .positive('El cliente no es válido')
        .optional()
})