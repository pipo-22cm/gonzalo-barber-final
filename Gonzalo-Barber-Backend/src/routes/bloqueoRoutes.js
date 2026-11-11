import { Router } from 'express';
import { BloqueoController } from '../controllers/bloqueoController.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { validarSchemas } from '../middlewares/validarSchemas.js'
import { crearBloqueoSchema} from '../schemas/bloqueoSchema.js'

const router = Router();


router.get('/',authMiddlewares, esAdmin, BloqueoController.listarBloqueos);
router.post('/',authMiddlewares, esAdmin,validarSchemas(crearBloqueoSchema), BloqueoController.crearBloqueo);
router.delete('/:id',authMiddlewares, esAdmin, BloqueoController.eliminarBloqueo);


export const bloqueoRoutes = router;