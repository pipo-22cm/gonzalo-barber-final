import { Router } from 'express';
import { VentaController } from '../controllers/ventaController.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { crearVentaSchema, ventaMostradorSchema } from '../schemas/ventaSchema.js';

const router = Router();


router.get('/', authMiddlewares, esAdmin, VentaController.listarVentas);
router.get('/mis-compras', authMiddlewares, VentaController.misCompras);
router.post('/', authMiddlewares, validarSchemas(crearVentaSchema), VentaController.crearPedido);
router.post('/mostrador', authMiddlewares, esAdmin, validarSchemas(ventaMostradorSchema), VentaController.crearVentaMostrador);
router.get('/:id', authMiddlewares, VentaController.verVenta);
router.patch('/:id/cancelar', authMiddlewares, VentaController.cancelarVenta);
router.patch('/:id/completar', authMiddlewares, esAdmin, VentaController.completarVenta);

export const ventaRoutes = router;
