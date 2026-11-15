import multer from 'multer'

export const capturadorDeError = (err,req,res,next)=>{
        console.error(`Error en ${req.method} ${req.originalUrl}`)
        console.error('Error:', err);
         if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            mensaje: 'El formato del JSON no es válido'
        });
        }

        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ mensaje: 'La imagen no puede pesar más de 5 MB' })
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ mensaje: 'La imagen tiene que venir en el campo "imagen"' })
            }
            return res.status(400).json({ mensaje: 'No se pudo subir la imagen' })
        }

        if (err.status === 400) {
            return res.status(400).json({ mensaje: err.message })
        }

        return res.status(500).json({ 
                mensaje: 'Error interno del servidor, por favor intente más tarde.'
             })
       
    }

export const rutaNoEncontrada = (req,res) =>{
    return res.status(404).json({mensaje: 'La ruta solicitada no existe'})
}

