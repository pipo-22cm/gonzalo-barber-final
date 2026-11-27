import { useState, useEffect } from 'react';
import { pedir } from '../../utils/api';
import { fechaHoy, sumarDias, formatearDia, formatearHora } from '../../utils/fechas';

const COLOR_ESTADO = {
  pendiente: 'bg-secondary',
  confirmado: 'bg-success',
  completado: 'bg-primary',
  cancelado: 'bg-danger',
};

export const AdminAgenda = () => {
  const [fecha, setFecha] = useState(fechaHoy());
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [procesando, setProcesando] = useState(null); 
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const data = await pedir(`/turnos?fecha=${fecha}`);
        const ordenados = [...data.turnos].sort(
          (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
        );
        setTurnos(ordenados);
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudieron cargar los turnos');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [fecha, recargar]);

  
  const cambiarDia = (nuevaFecha) => {
    setError('');
    setAviso('');
    setFecha(nuevaFecha);
  };

  const accion = async (idTurno, ruta, cuerpo, pregunta) => {
    if (pregunta && !window.confirm(pregunta)) return;

    setProcesando(idTurno);
    setError('');
    setAviso('');

    try {
      const data = await pedir(ruta, { metodo: 'PATCH', cuerpo });
      setAviso(data.mensaje);
      setRecargar((r) => r + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="panel">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h4 mb-0">
          Agenda · {formatearDia(`${fecha}T12:00:00`)}
        </h1>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <button type="button" className="btn btn-outline-light btn-sm" onClick={() => cambiarDia(sumarDias(fecha, -1))}>
            ‹
          </button>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={() => cambiarDia(fechaHoy())}>
            Hoy
          </button>
          <button type="button" className="btn btn-outline-light btn-sm" onClick={() => cambiarDia(sumarDias(fecha, 1))}>
            ›
          </button>
          <input
            type="date"
            className="form-control form-control-sm w-auto"
            value={fecha}
            onChange={(e) => e.target.value && cambiarDia(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {aviso && <div className="alert alert-success">{aviso}</div>}

      {cargando ? (
        <p className="mb-0">Cargando turnos...</p>
      ) : turnos.length === 0 ? (
        <p className="mb-0">No hay turnos este día.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((t) => {
                const activo = t.estado === 'pendiente' || t.estado === 'confirmado';
                const ocupado = procesando === t.id_turno;

                return (
                  <tr key={t.id_turno} className={t.estado === 'cancelado' ? 'opacity-50' : ''}>
                    <td>{formatearHora(t.fecha_hora)}</td>
                    <td>{t.usuarios?.nombre} {t.usuarios?.apellido}</td>
                    <td>{t.usuarios?.telefono || '-'}</td>
                    <td>{t.servicios?.nombre}</td>
                    <td><span className={`badge ${COLOR_ESTADO[t.estado]}`}>{t.estado}</span></td>
                    <td>
                      {activo && (
                        <div className="d-flex flex-wrap gap-1">
                          {t.estado === 'pendiente' && (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              disabled={ocupado}
                              onClick={() => accion(t.id_turno, `/turnos/${t.id_turno}/estado`, { estado: 'confirmado' })}
                            >
                              Confirmar
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-marca btn-sm"
                            disabled={ocupado}
                            onClick={() =>
                              accion(
                                t.id_turno,
                                `/turnos/${t.id_turno}/completar`,
                                undefined,
                                '¿Marcar el turno como completado? Se le suman los puntos al cliente.'
                              )
                            }
                          >
                            Completar
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            disabled={ocupado}
                            onClick={() =>
                              accion(t.id_turno, `/turnos/${t.id_turno}/estado`, { estado: 'cancelado' }, '¿Cancelar este turno?')
                            }
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};