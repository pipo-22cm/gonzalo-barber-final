import { UsuarioModel } from '../models/usuarioModel.js'

export class UsuarioController {

    static async verPerfil(req, res) {
        const usuario = await UsuarioModel.perfilPorId(req.user.id)
        if (!usuario) {
            return res.status(404).json({ mensaje: 'El usuario no existe' })
        }

        return res.status(200).json({ usuario })
    }

    static async actualizarPerfil(req, res) {
        const usuario = await UsuarioModel.perfilPorId(req.user.id)
        if (!usuario) {
            return res.status(404).json({ mensaje: 'El usuario no existe' })
        }

        const usuarioActualizado = await UsuarioModel.actualizarPerfil(req.user.id, req.body)
        return res.status(200).json({
            mensaje: 'Perfil actualizado con éxito',
            usuario: usuarioActualizado
        })
    }
}