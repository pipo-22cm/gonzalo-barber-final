import { Link } from 'react-router-dom';

export const Encabezado = () => {
  return (
    <header className="container py-3">
      <nav className="encabezado-menu d-flex flex-wrap justify-content-center justify-content-md-end gap-4">
        <Link to="/reservar">Turnos</Link>
        <Link to="/galeria">Trabajos</Link>
        <Link to="/productos">Productos</Link>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>
  );
};