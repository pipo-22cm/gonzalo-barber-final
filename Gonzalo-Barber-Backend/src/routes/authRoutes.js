import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { TurnoController } from "../controllers/turnoController.js";
import { authMiddlewares } from '../middlewares/authMiddlewares.js'

const router = Router();


router.post('/register' ,AuthController.createUsuario);
router.post('/login', AuthController.loginUsuario);
router.post('/logout', authMiddlewares, AuthController.logoutUsuario);
router.post('/crear', authMiddlewares, TurnoController.crearTurno);



export const authRoutes = router;
