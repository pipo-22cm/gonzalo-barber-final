import { Link } from 'react-router-dom';


export const Inicio = () => {
    return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white text-center p-3">
            <h1 className="display-4 fw-bold mb-3 text-warning">Gonzalo Barbershop</h1>
            <p className="lead mb-4">Expertos en Estilo y Tradición</p>     
            <Link to="/login" className="btn btn-warning btn-lg fw-bold px-5 text-dark">
                INGRESAR
            </Link>        
          </div>
    );
} 