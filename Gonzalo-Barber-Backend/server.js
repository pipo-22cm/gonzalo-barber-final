import 'dotenv/config'
import app from './src/app.js'
import { PORT } from './src/config/config.js'

app.listen(PORT, () => {
    console.log(`Servidor de Gonzalo Barber corriendo en http://localhost:${PORT}`)
})