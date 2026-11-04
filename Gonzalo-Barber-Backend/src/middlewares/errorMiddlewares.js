export const capturadorDeError = (err,req,res,next)=>{
        console.error('Error:', err);
         if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            mensaje: 'El formato del JSON no es válido'
        });
        }
        return res.status(500).json({ 
                mensaje: 'Error interno del servidor, por favor intente más tarde.'
             })
       
    }