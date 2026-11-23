import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { actualizarPerfilSchema } from '../schemas/usuarioSchema.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { esAdmin } from '../middlewares/adminMiddlewares.js';




const router = Router();


router.get('/perfil' ,authMiddlewares, UsuarioController.verPerfil);
router.get('/', authMiddlewares, esAdmin, UsuarioController.buscarClientes)
router.patch('/perfil' ,authMiddlewares, validarSchemas(actualizarPerfilSchema), UsuarioController.actualizarPerfil);





export const usuarioRoutes = router;
