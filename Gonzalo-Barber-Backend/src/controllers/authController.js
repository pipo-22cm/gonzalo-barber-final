import { UsuarioModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY , NODE_ENV } from '../config/config.js';

export class AuthController {

    static async createUsuario (req,res){
        
            const { nombre, apellido, email, password, telefono } = req.body;
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
                if(usuarioExistente){
                return res.status(409).json({mensaje: 'El correo electronico ya está registrado.'})
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
        
            res.clearCookie('token');

            return res.json({
                mensaje: 'Sesión cerrada correctamente'
            })
    }

}