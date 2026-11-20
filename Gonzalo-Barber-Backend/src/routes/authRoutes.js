import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { registroSchema, loginSchema, olvidePasswordSchema, restablecerPasswordSchema } from '../schemas/authSchema.js';
import { actualizarPerfilSchema, } from '../schemas/usuarioSchema.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';




const router = Router();

router.post('/register' ,validarSchemas(registroSchema), AuthController.createUsuario);
router.post('/login',validarSchemas(loginSchema), AuthController.loginUsuario);
router.post('/logout', authMiddlewares, AuthController.logoutUsuario);
router.post('/olvide-password', validarSchemas(olvidePasswordSchema), AuthController.olvidePassword)
router.post('/restablecer-password', validarSchemas(restablecerPasswordSchema), AuthController.restablecerPassword)





export const authRoutes = router;
