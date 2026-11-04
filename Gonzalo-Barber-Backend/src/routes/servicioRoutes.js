import { Router } from 'express';
import { ServicioController } from '../controllers/servicioController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { crearServicioSchema, actualizarServicioSchema } from '../schemas/servicioSchema.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';





const router = Router();

router.get('/',ServicioController.listarActivos);
router.get('/todos' , authMiddlewares, esAdmin, ServicioController.listarTodos);
router.get('/:id',ServicioController.obtenerPorId );
router.post('/', authMiddlewares, esAdmin, validarSchemas(crearServicioSchema), ServicioController.crearServicio);
router.patch('/:id', authMiddlewares, esAdmin, validarSchemas(actualizarServicioSchema), ServicioController.actualizarServicio);
router.patch('/:id/baja', authMiddlewares, esAdmin, ServicioController.bajaServicio);




export const servicioRoutes = router;
