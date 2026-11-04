export const esAdmin =  (req, res, next) => {
    const rol = req.user.rol;
    
    if(rol !== 'admin'){
        return res.status(403).json({ mensaje: 'No ténes autorización para acceder' });
    }

    next();
};
