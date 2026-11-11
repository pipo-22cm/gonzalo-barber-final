import { Router } from 'express';
import { CategoriaController } from '../controllers/categoriaController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { categoriaSchema } from '../schemas/categoriaSchema.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';


const router = Router();

router.get('/',CategoriaController.listarCategorias);
router.get('/:id',CategoriaController.obtenerPorId);
router.post('/',authMiddlewares,esAdmin,validarSchemas(categoriaSchema),CategoriaController.crearCategoria);
router.patch('/:id',authMiddlewares,esAdmin,validarSchemas(categoriaSchema),CategoriaController.actualizarCategoria);
router.delete('/:id',authMiddlewares,esAdmin,CategoriaController.borrarCategoria);




export const categoriaRoutes = router;

