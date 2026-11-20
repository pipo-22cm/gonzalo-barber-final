import { UsuarioModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY , NODE_ENV } from '../config/config.js';
import { randomBytes, createHash } from 'node:crypto'
import { enviarMail } from '../utils/enviarMail.js'
import { FRONTEND_URL } from '../config/config.js'
import { MINUTOS_VENCE_RESET } from '../config/negocio.js'

function hashearToken (token) {
  return createHash('sha256').update(token).digest('hex')
}



export class AuthController {

    static async createUsuario (req,res){
        
            const { nombre, apellido, email, password, telefono } = req.body;
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
                if(usuarioExistente){
                return res.status(409).json({mensaje: 'El correo electrónico ya está registrado'})
                }
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const idUsuario = await UsuarioModel.createUsuario({
                nombre,
                apellido,
                email,
                password: passwordHash,
                telefono
            })

            return res.status(201).json({
                mensaje: 'Usuario registrado con éxito',
                id: idUsuario
            })
    }

    static async loginUsuario (req,res) {
    
            const {email, password} = req.body;
            const usuario = await UsuarioModel.buscarPorEmail(email);
            if(!usuario){
                return res.status(401).json({mensaje: 'Email o contraseña incorrecta'})
            }
            const esPasswordvalida = await bcrypt.compare(password,usuario.password);
            if(!esPasswordvalida){
                return res.status(401).json({mensaje: 'Email o contraseña incorrecta'})
            }
            const token = jwt.sign(
                {id: usuario.id_usuario, email: usuario.email, rol: usuario.rol},
                SECRET_JWT_KEY,
                {expiresIn: '1h'}
            );

            return res.status(200)
            .cookie('token', token,{
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            })
            .json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    telefono: usuario.telefono,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
    }

    static async logoutUsuario (req,res) {
        
            res.clearCookie('token', {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.json({
                mensaje: 'Sesión cerrada correctamente'
            })
    }

    static async olvidePassword (req, res) {
    const { email } = req.body
    const mensaje = 'Si el email está registrado, te enviamos un enlace para restablecer la contraseña'
        
    const usuario = await UsuarioModel.buscarPorEmail(email)
    if (!usuario) return res.json({ mensaje })
    
    const token = randomBytes(32).toString('hex')
    const expira = new Date(Date.now() + MINUTOS_VENCE_RESET * 60 * 1000)
    await UsuarioModel.guardarTokenReset(usuario.id_usuario, hashearToken(token), expira)
    
    const enlace = `${FRONTEND_URL}/restablecer-password?token=${token}`
    try {
      await enviarMail({
        para: usuario.email,
        asunto: 'Restablecer tu contraseña - Gonzalo Barber',
        html: `<p>Hola ${usuario.nombre}:</p>
               <p>Para elegir una contraseña nueva, entrá a este enlace (vence en ${MINUTOS_VENCE_RESET} minutos):</p>
               <p><a href="${enlace}">${enlace}</a></p>
               <p>Si no lo pediste, ignorá este mail.</p>`
      })
    } catch (error) {
      console.error('Error al enviar el mail de recuperación:', error)
    }

    res.json({ mensaje })
}

    static async restablecerPassword (req, res) {
      const { token, password } = req.body
    
      const usuario = await UsuarioModel.buscarPorTokenReset(hashearToken(token))
      if (!usuario || usuario.reset_token_expira < new Date()) {
        return res.status(400).json({ mensaje: 'El enlace no es válido o ya venció. Pedí uno nuevo' })
      }
  
      const passwordHash = await bcrypt.hash(password, 10)
      await UsuarioModel.cambiarPassword(usuario.id_usuario, passwordHash)
  
      res.json({ mensaje: 'Contraseña actualizada. Ya podés iniciar sesión' })
    }

}