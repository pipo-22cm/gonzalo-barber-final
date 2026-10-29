import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';


export const Servicio = sequelize.define('Servicio',{
    id_servicio: {
        type: DataTypes.INTERGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
    },
    precio: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    duracion:{
        type: DataTypes.INTERGER,
        allowNull: false
    }
    estado: {
        type: DataTypes.BOLEAN,
    }
}), {
    tableName: 'servicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
}