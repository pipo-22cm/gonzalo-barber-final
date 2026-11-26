import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

// Secciones del menú (se van sumando a medida que las hacemos)
const secciones = [
  { ruta: '/admin', texto: 'Inicio', end: true },
  { ruta: '/admin/agenda', texto: 'Agenda' },
];

export const PanelAdmin = () => {
  const { usuario, cerrarSesion } = useContext(AuthContext);

  return (
    <div className="pagina-admin">
      <header className="border-bottom border-secondary">
        <div className="container-fluid py-2 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo Gonzalo Barbershop" className="rounded-circle" width="40" height="40" />
            <span className="fw-bold">Panel de administración</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small">{usuario.nombre}</span>
            <button type="button" className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <nav className="admin-menu container-fluid">
          <ul className="nav">
            {secciones.map((s) => (
              <li className="nav-item" key={s.ruta}>
                <NavLink to={s.ruta} end={s.end} className="nav-link">
                  {s.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="flex-grow-1 container-fluid py-4">
        {/* Acá React Router dibuja la sección según la URL */}
        <Outlet />
      </main>
    </div>
  );
};