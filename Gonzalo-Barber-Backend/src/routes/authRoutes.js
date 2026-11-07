import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { validarSchemas } from '../middlewares/validarSchemas.js';
import { registroSchema, loginSchema } from '../schemas/authSchema.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';



const router = Router();


router.post('/register' ,validarSchemas(registroSchema), AuthController.createUsuario);
router.post('/login',validarSchemas(loginSchema), AuthController.loginUsuario);
router.post('/logout', authMiddlewares, AuthController.logoutUsuario);





export const authRoutes = router;
