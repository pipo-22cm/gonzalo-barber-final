import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export const NoEncontrada = () => {
  return (
    <div className="pagina justify-content-center align-items-center text-center p-3">
      <div className="tarjeta w-100" style={{ maxWidth: '420px' }}>
        <img
          src={logo}
          alt="Logo Gonzalo Barbershop"
          className="rounded-circle mb-3"
          width="100"
          height="100"
        />

        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-5 mb-4">La página que buscás no existe.</p>

        <Link to="/" className="btn btn-marca btn-lg px-5">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};