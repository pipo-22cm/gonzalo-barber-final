import { UsuarioModel } from "../models/usuarioModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/config.js';

export class AuthController {

    static async createUsuario (req,res){
        
        try {
            const { nombre, apellido, email, password, telefono } = req.body;
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
                telefono
            })

            return res.status(201).json({
                mensaje: 'Usuario registrado con éxito',
                id: idUsuario
            })
        }catch(error){
            console.error('Error al registrar usuario:', error);
            return res.status(500).json({ 
                mensaje: 'Error al registrar usuario, por favor intente mas tarde.'
             })
        }
    }

    static async loginUsuario (req,res) {
    
        try{
            const {email, password} = req.body;
            const usuario = await UsuarioModel.buscarPorEmail(email);
            if(!usuario){
                return res.status(401).json({mensaje: 'Usuario no encontrado'})
            }
            const esPasswordvalida = await bcrypt.compare(password,usuario.password);
            if(!esPasswordvalida){
                return res.status(401).json({mensaje: 'Contraseña incorrecta'})
            }
            const token = jwt.sign(
                {id: usuario.id_usuario, email: usuario.email, rol: usuario.rol},
                SECRET_JWT_KEY,
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
            console.error('Error al iniciar sesión:', error);
            return res.status(500).json({ 
                mensaje: 'Error al iniciar sesión, por favor intente mas tarde.'
            });
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
            console.error('Error al cerrar sesión:', error);
            return res.status(500).json({
                mensaje: 'Hubo un error al cerrar sesión'
            });
        }
    }

}