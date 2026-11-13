import prisma  from '../config/db.js';

const camposPerfil = {
    id_usuario: true,
    nombre: true,
    apellido: true,
    email: true,
    telefono: true,
    rol: true,
    puntos: true,
    created_at: true
}

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

    static async perfilPorId(id) {
    return await prisma.usuarios.findUnique({
        where: { id_usuario: id },
        select: camposPerfil
    })
    }
    
    static async actualizarPerfil(id, datos) {
    return await prisma.usuarios.update({
        where: { id_usuario: id },
        data: datos,
        select: camposPerfil
    })
    }
    
}
