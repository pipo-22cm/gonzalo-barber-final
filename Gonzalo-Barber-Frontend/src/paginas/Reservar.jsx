import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Encabezado } from '../componentes/Encabezado';
import { PiePagina } from '../componentes/PiePagina';

export const Reservar = () => {
    const { usuario, setUsuario } = useContext(AuthContext);
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [servicioElegido, setServicioElegido] = useState(null);
    const [error, setError] = useState('');
    const [fecha, setFecha] = useState('');
    const [horarios, setHorarios] = useState([]);
    const [horaElegida, setHoraElegida] = useState(null);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);
    const [recargar, setRecargar] = useState(0);         
    const [enviando, setEnviando] = useState(false);     
    const [errorReserva, setErrorReserva] = useState('');
    const [mensajeOk, setMensajeOk] = useState('');      

    useEffect(() => {
      const cargarServicios = async () => {
        try {
          const res = await fetch('http://localhost:3000/gonzaloBarber/servicios');
          const data = await res.json();
      
          if (!res.ok) {
            setError(data.mensaje);
            return;
          }
      
          setServicios(data.servicios);
        } catch (err) {
          console.error(err);
          setError('No se pudo conectar con el servidor');
        }
      };

      cargarServicios();
    }, []);

      
    useEffect(() => {
    
        if (!servicioElegido || !fecha) return;

        const cargarHorarios = async () => {
          setHoraElegida(null); 
          setHorarios([]);
          setError('');
          setCargandoHorarios(true);

          try {
            const res = await fetch(
              `http://localhost:3000/gonzaloBarber/turnos/disponibilidad?fecha=${fecha}&servicio_id=${servicioElegido.id_servicio}`
            );
            const data = await res.json();

            if (!res.ok) {
              setError(data.mensaje);
              return;
            }

            setHorarios(data.horarios);
          } catch (err) {
            console.error(err);
            setError('No se pudo conectar con el servidor');
          } finally {
            setCargandoHorarios(false);
          }
        };

        cargarHorarios();
    }, [servicioElegido, fecha, recargar]);

    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hoy = `${anio}-${mes}-${dia}`;

      
    const fechaLinda = fecha.split('-').reverse().join('/');
    
    const reservar = async () => {
    
        if (!usuario) {
          navigate('/login');
          return;
        }

        setEnviando(true);
        setErrorReserva('');

        try {
          const res = await fetch('http://localhost:3000/gonzaloBarber/turnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              servicio_id: servicioElegido.id_servicio,
              fecha,
              hora: horaElegida,
            }),
          });
          const data = await res.json();

          if (res.status === 401) {
            setUsuario(null);
            navigate('/login');
            return;
          }

          if (!res.ok) {
            setErrorReserva(data.mensaje);
            if (res.status === 409) setRecargar((r) => r + 1);
            return;
          }

          setMensajeOk(data.mensaje);
        } catch (err) {
          console.error(err);
          setErrorReserva('No se pudo conectar con el servidor');
        } finally {
          setEnviando(false);
        }
    };

    const reservarOtro = () => {
      setMensajeOk('');
      setHoraElegida(null);
      setRecargar((r) => r + 1);
    };

    if (mensajeOk) {
      return (
        <div className="pagina">
          <Encabezado />
          <main className="flex-grow-1 d-flex justify-content-center align-items-center p-3">
            <div className="tarjeta w-100 text-center" style={{ maxWidth: '480px' }}>
              <h1 className="h3 mb-3">¡Turno reservado!</h1>
              <div className="alert alert-success">{mensajeOk}</div>
              <p className="mb-1"><strong>{servicioElegido.nombre}</strong></p>
              <p className="mb-4">{fechaLinda} a las {horaElegida} hs</p>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Link to="/perfil" className="btn btn-marca">Ir a mi perfil</Link>
                <button type="button" className="btn btn-outline-light" onClick={reservarOtro}>
                  Reservar otro turno
                </button>
              </div>
            </div>
          </main>
          <PiePagina />
        </div>
      );
    }

  return (
    <div className="pagina">
      <Encabezado />

      <main className="flex-grow-1 d-flex justify-content-center align-items-start p-3">
        <div className="tarjeta w-100 my-4" style={{ maxWidth: '700px' }}>
          <h1 className="h2 text-center mb-4">Reservá tu turno</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <h2 className="h5 mb-3">1. Elegí el servicio</h2>

          <div className="row g-3">
            {servicios.map((servicio) => (
              <div className="col-12 col-md-6" key={servicio.id_servicio}>
                <button
                  type="button"
                  className={`btn w-100 h-100 text-start p-3 ${
                    servicioElegido?.id_servicio === servicio.id_servicio
                      ? 'btn-marca'
                      : 'btn-outline-light'
                  }`}
                  onClick={() => setServicioElegido(servicio)}
                >
                  <span className="d-block fw-bold">{servicio.nombre}</span>
                  <span className="d-block small">
                    {servicio.duracion} min · ${servicio.precio}
                  </span>
                </button>
              </div>
            ))}
          </div>
          {servicioElegido && (
            <>
              <h2 className="h5 mt-4 mb-3">2. Elegí el día</h2>

              <input
                type="date"
                className="form-control"
                min={hoy}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <p className="small mt-2 mb-0">Atendemos de martes a sábado.</p>
            </>
          )}
          {servicioElegido && fecha && (
            <>
              <h2 className="h5 mt-4 mb-3">3. Elegí el horario</h2>

              {cargandoHorarios ? (
                <p>Buscando horarios...</p>
              ) : horarios.length === 0 ? (
                <p>No hay horarios libres ese día, probá con otro.</p>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {horarios.map((hora) => (
                    <button
                      key={hora}
                      type="button"
                      className={`btn ${hora === horaElegida ? 'btn-marca' : 'btn-outline-light'}`}
                      onClick={() => {
                        setHoraElegida(hora)
                        setErrorReserva('');
                      }}
                      
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
                    {errorReserva && <div className="alert alert-danger mt-4">{errorReserva}</div>}

          {horaElegida && (
            <>
              <h2 className="h5 mt-4 mb-3">4. Confirmá tu turno</h2>

              <div className="border rounded p-3 mb-3">
                {usuario && (
                  <p className="mb-1"><strong>Cliente:</strong> {usuario.nombre} {usuario.apellido}</p>
                )}
                <p className="mb-1"><strong>Servicio:</strong> {servicioElegido.nombre}</p>
                <p className="mb-1"><strong>Día:</strong> {fechaLinda}</p>
                <p className="mb-1"><strong>Hora:</strong> {horaElegida} hs</p>
                <p className="mb-0">
                  <strong>Precio:</strong> ${Number(servicioElegido.precio).toLocaleString('es-AR')}
                </p>
              </div>

              {!usuario && (
                <p className="small">Para reservar tenés que iniciar sesión.</p>
              )}

              <button
                type="button"
                className="btn btn-marca btn-lg w-100"
                onClick={reservar}
                disabled={enviando}
              >
                {enviando ? 'Reservando...' : 'RESERVAR'}
              </button>
            </>
          )}
        </div>
      </main>

      <PiePagina />
    </div>
  );
};