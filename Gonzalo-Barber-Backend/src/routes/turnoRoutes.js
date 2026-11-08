import { Router } from 'express';
import { TurnoController } from '../controllers/turnoController.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { crearTurnoSchema, cambiarEstadoSchema} from '../schemas/turnoSchema.js'
import { validarSchemas } from '../middlewares/validarSchemas.js'


const router = Router();


router.get('/',authMiddlewares, esAdmin, TurnoController.listarPorFecha);
router.get('/mis-turnos',authMiddlewares, TurnoController.misTurnos);
router.post('/',authMiddlewares,validarSchemas(crearTurnoSchema), TurnoController.crearTurno);
router.patch('/:id/cancelar', authMiddlewares, TurnoController.cancelarMiTurno);
router.patch('/:id/estado', authMiddlewares, esAdmin, validarSchemas(cambiarEstadoSchema), TurnoController.cambiarEstado);
router.patch('/:id/completar', authMiddlewares, esAdmin, TurnoController.completarTurno);




export const turnoRoutes = router;


