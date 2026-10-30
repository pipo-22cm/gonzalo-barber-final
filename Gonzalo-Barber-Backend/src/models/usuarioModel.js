import prisma  from '../config/db.js';

export class UsuarioModel {

    static async buscarPorEmail(email) {
       return await prisma.usuarios.findUnique({
        where: { email: email }
    });
    }

    static async createUsuario(nuevoUsuario){
        const usuariosCreado = await prisma.usuarios.create({
            data: {
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email,
                password: nuevoUsuario.password,
                telefono: nuevoUsuario.telefono,
            },
            select: {
                id_usuario: true
            }
        });
        return usuariosCreado.id_usuario;
    }

}
