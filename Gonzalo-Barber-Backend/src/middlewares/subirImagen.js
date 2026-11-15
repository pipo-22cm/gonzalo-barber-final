import multer from 'multer'

// Extensión que le ponemos al archivo según su tipo
const EXTENSIONES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
}

// 1. Dónde y con qué nombre se guarda
const storage = multer.diskStorage({
    destination: 'uploads/galeria',     // la carpeta donde van las fotos de la galería
    filename: (req, file, cb) => {
        const nombre = `${Date.now()}-${Math.round(Math.random() * 1000)}`
        cb(null, nombre + EXTENSIONES[file.mimetype])
    }
})

// 2. Qué formatos se aceptan
const fileFilter = (req, file, cb) => {
    if (EXTENSIONES[file.mimetype]) {            // ¿el tipo del archivo está en EXTENSIONES?
        cb(null, true)    // se acepta
    } else {
        const error = new Error('La imagen tiene que ser JPG, PNG o WEBP')
        error.status = 400
        cb(error)         // se rechaza
    }
}

// 3. Peso máximo
export const subirImagen = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }    // 5 MB, en bytes
}).single('imagen')