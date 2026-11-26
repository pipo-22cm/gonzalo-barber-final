import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { Encabezado } from '../componentes/Encabezado.jsx';
import { PiePagina } from '../componentes/PiePagina.jsx';
import './Perfil.css';


const formatearDia = (fechaHora) =>
  new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

const formatearHora = (fechaHora) =>
  new Date(fechaHora).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

export const Perfil = () => {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [errorTurnos, setErrorTurnos] = useState('');
  const [avisoTurnos, setAvisoTurnos] = useState('');      // mensaje verde al cancelar
  const [cancelando, setCancelando] = useState(null);      // id del turno que se está cancelando
  const [recargarTurnos, setRecargarTurnos] = useState(0); // al sumarle 1, se vuelven a pedir los turnos

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

  useEffect(() => {
    if (usuario?.rol !== 'cliente') return;

    const cargarTurnos = async () => {
      try {
        const res = await fetch('http://localhost:3000/gonzaloBarber/turnos/mis-turnos', {
          credentials: 'include', 
        });
        const data = await res.json();

        if (!res.ok) {
          setErrorTurnos(data.mensaje);
          return;
        }

        setTurnos(data.turnos);
      } catch (err) {
        console.error(err);
        setErrorTurnos('No se pudieron cargar los turnos');
      }
    };

    cargarTurnos();
  }, [usuario, recargarTurnos]);

  const cancelarTurno = async (idTurno) => {

    if (!window.confirm('¿Seguro que querés cancelar este turno?')) return;

    setCancelando(idTurno);
    setErrorTurnos('');
    setAvisoTurnos('');

    try {
      const res = await fetch(
        `http://localhost:3000/gonzaloBarber/turnos/${idTurno}/cancelar`,
        { method: 'PATCH', credentials: 'include' }
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorTurnos(data.mensaje);
        return;
      }

      setAvisoTurnos(data.mensaje);
      setRecargarTurnos((r) => r + 1);
    } catch (err) {
      console.error(err);
      setErrorTurnos('No se pudo conectar con el servidor');
    } finally {
      setCancelando(null);
    }
  };

if (error) {
  return <p className="text-white text-center mt-5">{error}</p>;
}

if (!perfil) {
  return <p className="text-white text-center mt-5">Cargando...</p>;
}

  const ahora = new Date();

  const proximos = turnos
    .filter((t) =>
      (t.estado === 'pendiente' || t.estado === 'confirmado') &&
      new Date(t.fecha_hora) > ahora
    )
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

  
  const historial = turnos
    .filter((t) => t.estado === 'completado')
    .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

  

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
          {usuario.rol === 'cliente' && (
            <>
              <h2 className="h5 mt-4 mb-3">Próximos turnos</h2>

              {errorTurnos && <div className="alert alert-danger">{errorTurnos}</div>}
              {avisoTurnos && <div className="alert alert-success">{avisoTurnos}</div>}

              {proximos.length === 0 ? (
                <p>
                  No tenés turnos próximos.{' '}
                  <Link to="/reservar" className="link-light">Reservá uno</Link>
                </p>
              ) : (
                proximos.map((t) => (
                  <div key={t.id_turno} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <p className="mb-1 fw-bold">
                      {formatearDia(t.fecha_hora)} · {formatearHora(t.fecha_hora)} hs
                    </p>
                    <div>
                      <p className="mb-0">
                        {t.servicios?.nombre}{' '}
                        <span className={`badge ms-2 ${t.estado === 'confirmado' ? 'bg-success' : 'bg-secondary'}`}>
                        {t.estado}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      onClick={() => cancelarTurno(t.id_turno)}
                      disabled={cancelando === t.id_turno}
                    >
                      {cancelando === t.id_turno ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  </div>
                ))
              )}

              <h2 className="h5 mt-4 mb-3">Historial</h2>

              {historial.length === 0 ? (
                <p>Todavía no tenés cortes registrados.</p>
              ) : (
                historial.map((t) => (
                  <div key={t.id_turno} className="border rounded p-3 mb-2">
                    <p className="mb-1 fw-bold">{formatearDia(t.fecha_hora)}</p>
                    <p className="mb-0">{t.servicios?.nombre}</p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>

      <PiePagina />
    </div>
  );
};