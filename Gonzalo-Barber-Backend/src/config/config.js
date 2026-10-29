import dotenv from 'dotenv'
dotenv.config()



export const {
    PORT = 3000,
    SECRET_JWT_KEY = 'cl4v3_SECr3t4_p0i5p9o8_uN1ca',
    NODE_ENV = 'development'
} = process.env