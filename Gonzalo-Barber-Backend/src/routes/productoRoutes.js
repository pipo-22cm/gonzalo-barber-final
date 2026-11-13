import { Router } from 'express';
import { ProductoController } from '../controllers/productoController.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { crearProductoSchema, actualizarProductoSchema} from '../schemas/productoSchema.js'
import { validarSchemas } from '../middlewares/validarSchemas.js'


const router = Router();

router.get('/', ProductoController.listarCatalogo);
router.get('/todos',authMiddlewares, esAdmin, ProductoController.listarTodos);
router.get('/:id',ProductoController.obtenerPorId);
router.post('/',authMiddlewares, esAdmin,validarSchemas(crearProductoSchema), ProductoController.crearProducto);
router.patch('/:id',authMiddlewares, esAdmin, validarSchemas(actualizarProductoSchema), ProductoController.actualizarProducto);
router.patch('/:id/baja',authMiddlewares, esAdmin, ProductoController.darDeBajaProducto);
router.patch('/:id/reactivar',authMiddlewares, esAdmin, ProductoController.reactivarProducto);


export const productoRoutes = router;