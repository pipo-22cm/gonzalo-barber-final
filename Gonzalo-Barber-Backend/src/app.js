import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authRoutes }  from './routes/authRoutes.js'
import { servicioRoutes }  from './routes/servicioRoutes.js'
import { turnoRoutes }  from './routes/turnoRoutes.js'
import { bloqueoRoutes }  from './routes/bloqueoRoutes.js'
import { categoriaRoutes }  from './routes/categoriaRoutes.js'
import { productoRoutes }  from './routes/productoRoutes.js'
import { capturadorDeError, rutaNoEncontrada } from './middlewares/errorMiddlewares.js'


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Permite el envío de cookies entre React y Express
}))
app.use(express.json())
app.use(cookieParser())

app.use('/gonzaloBarber/auth', authRoutes)
app.use('/gonzaloBarber/servicios', servicioRoutes)
app.use('/gonzaloBarber/turnos', turnoRoutes)
app.use('/gonzaloBarber/bloqueos', bloqueoRoutes)
app.use('/gonzaloBarber/categorias', categoriaRoutes)
app.use('/gonzaloBarber/productos', productoRoutes)
app.use(rutaNoEncontrada)
app.use(capturadorDeError)


export default app