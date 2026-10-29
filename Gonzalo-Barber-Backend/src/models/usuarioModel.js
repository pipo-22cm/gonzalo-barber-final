import { sequelize } from '../config/db.js';

export class UsuarioModel {

    static async buscarPorEmail(email) {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    }

    static async createUsuario(nuevoUsuario){
        const {nombre,apellido,email,password,telefono,rol} = nuevoUsuario;
        const [result] = await db.execute('INSERT INTO usuarios (nombre,apellido,email,password,telefono,rol) VALUES (?,?,?,?,?,?)',[nombre,apellido,email,password,telefono,rol])
        return result.insertId;
    }

    static async loginUsuario (email){
        const [rows] = await db.execute ('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows [0];
    }

}
