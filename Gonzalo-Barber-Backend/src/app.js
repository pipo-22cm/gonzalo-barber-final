import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import { authRoutes }  from './routes/authRoutes.js'


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Permite el envío de cookies entre React y Express
}))
app.use(express.json())
app.use(cookieParser())

app.use('/gonzaloBarber/auth', authRoutes)


export default app