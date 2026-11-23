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

    static async guardarTokenReset (id, tokenHash, expira) {
    return prisma.usuarios.update({
      where: { id_usuario: id },
      data: { reset_token_hash: tokenHash, reset_token_expira: expira },
      select: { id_usuario: true }
    })
    }

    static async buscarPorTokenReset (tokenHash) {
    return prisma.usuarios.findUnique({
        where: { reset_token_hash: tokenHash },
        select: { id_usuario: true, reset_token_expira: true }
    })
    }

    static async cambiarPassword (id, passwordHash) {
    return prisma.usuarios.update({
        where: { id_usuario: id },
        data: { password: passwordHash, reset_token_hash: null, reset_token_expira: null },
        select: { id_usuario: true }
    })
    }

    static async buscarClientes (texto) {
    return prisma.usuarios.findMany({
        where: {
          rol: 'cliente',
          OR: [
            { nombre: { contains: texto } },
            { apellido: { contains: texto } },
            { email: { contains: texto } }
          ]
        },
        select: { id_usuario: true, nombre: true, apellido: true, email: true, telefono: true },
        orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
        take: 10
  })
}
    
}
