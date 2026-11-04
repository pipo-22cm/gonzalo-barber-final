import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { authRoutes }  from './routes/authRoutes.js'
import { servicioRoutes }  from './routes/servicioRoutes.js'
import { capturadorDeError } from './middlewares/errorMiddlewares.js'


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Permite el envío de cookies entre React y Express
}))
app.use(express.json())
app.use(cookieParser())

app.use('/gonzaloBarber/auth', authRoutes)
app.use('/gonzaloBarber/servicios', servicioRoutes)
app.use(capturadorDeError)


export default app