import { Router } from 'express';
import { subirImagen } from '../middlewares/subirImagen.js';
import { GaleriaController } from '../controllers/galeriaController.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { subirImagenSchema, editarDescripcionSchema } from '../schemas/galeriaSchema.js';




const router = Router();

router.get('/',GaleriaController.listarImagenes);
router.post('/', authMiddlewares, esAdmin, subirImagen, validarSchemas(subirImagenSchema), GaleriaController.subirImagen);
router.patch('/:id',authMiddlewares, esAdmin,validarSchemas(editarDescripcionSchema), GaleriaController.editarDescripcion );
router.delete('/:id',authMiddlewares, esAdmin, GaleriaController.eliminarImagen);

export const galeriaRoutes = router;
