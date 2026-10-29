import { UsuarioModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export class AuthController {

    static async createUsuario (req,res){
        
        try {
            const { nombre, apellido, email, password, telefono, rol } = req.body;
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
                if(usuarioExistente){
                return res.status(400).json({mensaje: 'El correo electronico ya está registrado.'})
                }
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            const idUsuario = await UsuarioModel.createUsuario({
                nombre,
                apellido,
                email,
                password: passwordHash,
                telefono,
                rol
            })
            return res.status(201).json({
                mensaje: 'Usuario registrado con éxito',
                id: idUsuario
            })
        }catch(error){
            return res.status(500).json({ error: error.message })
        }
    }

    static async loginUsuario (req,res) {
    
        try{
            const {email, password} = req.body;
            const usuario = await UsuarioModel.loginUsuario(email);
            if(!usuario){
                return res.status(401).json({mensaje: 'Usuario no encontrado'})
            }
            const esPasswordvalida = await bcrypt.compare(password,usuario.password);
            if(!esPasswordvalida){
                return res.status(401).json({mensaje: 'Contraseña incorrecta'})
            }
            const token = jwt.sign(
                {id: usuario.id_usuario, email: usuario.email, rol: usuario.rol},
                process.env.SECRET_JWT_KEY || 'cl4v3_SECr3t4_p0i5p9o8_uN1ca',
                {expiresIn: '1h'}
            );

            return res.status(200)
            .cookie('token', token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'produccion',
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
        }catch(error){
            return res.status(500).json({ error: error.message });
        }
    }

    static async logoutUsuario (req,res) {
        try {
            res.clearCookie('token');

            return res.json({
                ok: true,
                mensaje: 'Sesión cerrada correctamente'
            })

        }catch(error){
            return res.status(500).json({
                ok: false,
                mensaje: 'Hubo un error al cerrar sesión'
            });
        }
    }

}