import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { actualizarPerfilSchema } from '../schemas/usuarioSchema.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';



const router = Router();


router.get('/perfil' ,authMiddlewares, UsuarioController.verPerfil);
router.patch('/perfil' ,authMiddlewares, validarSchemas(actualizarPerfilSchema), UsuarioController.actualizarPerfil);





export const usuarioRoutes = router;
