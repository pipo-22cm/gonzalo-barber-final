import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


export const sequelize = new Sequelize(
    process.env.DB_NAME || 'gonzalo_barber',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'pipo_0598',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false 
    }
)

