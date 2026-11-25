import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export const PanelAdmin = () => {
  const { usuario, cerrarSesion } = useContext(AuthContext);

  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
        <button className="btn btn-danger" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
      <hr className="bg-light" />
      <p>Bienvenido, {usuario.nombre} a Gonzalo Barber.</p>
    </div>
  );
};