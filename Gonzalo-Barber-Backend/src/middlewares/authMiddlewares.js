import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';


export const authMiddlewares = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, acceso no autorizado' });
    }

    try {
        req.user = jwt.verify(token, SECRET_JWT_KEY);
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }

    next();
}