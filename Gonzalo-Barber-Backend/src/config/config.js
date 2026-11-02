
export const {
    PORT = 3000,
    SECRET_JWT_KEY,
    NODE_ENV = 'development'
} = process.env


if(!SECRET_JWT_KEY){
    throw new Error("Falta definir SECRET_JWT_KEY en el .env")
}