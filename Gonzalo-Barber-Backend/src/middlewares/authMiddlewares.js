import jwt from 'jsonwebtoken';
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;



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
        process.env.SECRET_JWT_KEY || 'cl4v3_SECr3t4_p0i5p9o8_uN1ca'
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

