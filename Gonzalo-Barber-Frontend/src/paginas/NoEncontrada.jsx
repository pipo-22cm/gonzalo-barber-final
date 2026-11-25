import { Link } from 'react-router-dom';

export const NoEncontrada = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white text-center p-3">
      <h1 className="display-1 fw-bold text-warning">404</h1>
      <p className="lead mb-4">La página que buscás no existe.</p>
      <Link to="/" className="btn btn-warning btn-lg fw-bold px-5 text-dark">
        Volver al inicio
      </Link>
    </div>
  );
};