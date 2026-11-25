import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Encabezado } from '../componentes/Encabezado.jsx';
import { PiePagina } from '../componentes/PiePagina.jsx';
import './Perfil.css';

export const Perfil = () => {
  const { cerrarSesion } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/gonzaloBarber/usuarios/perfil', {
          credentials: 'include'
        });

        if (!respuesta.ok) {
          setError('No pudimos cargar tu perfil.');
          return;
        }

        const data = await respuesta.json();
        setPerfil(data.usuario);
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        setError('No se pudo conectar con el servidor.');
      }
    };

    cargarPerfil();
  }, []);

if (error) {
  return <p className="text-white text-center mt-5">{error}</p>;
}

if (!perfil) {
  return <p className="text-white text-center mt-5">Cargando...</p>;
}

  return (
    <div className="pagina">
      <Encabezado />

      <main className="container py-5 flex-grow-1">
        <div className="tarjeta">
          <h1 className="mb-1">Hola, {perfil.nombre}</h1>
          <p className="text-white-50 mb-4">Este es tu perfil en Gonzalo Barbershop.</p>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="perfil-puntos">
                <span className="perfil-puntos-numero">{perfil.puntos}</span>
                <span>puntos acumulados</span>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <h2 className="h5 mb-3">Tus datos</h2>
              <p className="mb-1">{perfil.nombre} {perfil.apellido}</p>
              <p className="mb-1">{perfil.email}</p>
              <p className="mb-4">{perfil.telefono || 'Sin teléfono cargado'}</p>

              <div className="d-flex flex-wrap gap-2">
                <Link to="/reservar" className="btn btn-marca">
                  Reservar turno
                </Link>
                <button className="btn btn-outline-light" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PiePagina />
    </div>
  );
};