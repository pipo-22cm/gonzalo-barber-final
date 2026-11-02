import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';




export const authMiddlewares = async (req, res, next) => {

    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                ok: false,
                mensaje: 'No hay token, acceso no autorizado'
            });
        }
    const verificacion = jwt.verify (
        token, 
        SECRET_JWT_KEY
    );
    
    req.user = verificacion
    next ();
    
    }catch(error){
        return res.status(403).json({
            ok: false,
            mensaje: 'Token inválido o expirado'
        });
    }
}

