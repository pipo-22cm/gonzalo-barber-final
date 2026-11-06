import { Router } from 'express';
import { TurnoController } from '../controllers/turnoController.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { crearTurnoSchema } from '../schemas/turnoSchema.js'
import { validarSchemas } from '../middlewares/validarSchemas.js'


const router = Router();


router.get('/',authMiddlewares, esAdmin, TurnoController.listarPorFecha);
router.get('/mis-turnos',authMiddlewares, TurnoController.misTurnos);
router.post('/',authMiddlewares,validarSchemas(crearTurnoSchema), TurnoController.crearTurno);








export const turnoRoutes = router;


