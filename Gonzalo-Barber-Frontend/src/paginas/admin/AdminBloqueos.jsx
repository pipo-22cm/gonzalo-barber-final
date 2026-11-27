import { useState, useEffect } from 'react';
import { pedir } from '../../utils/api';
import { fechaHoy, formatearDia, formatearHora } from '../../utils/fechas';


const FORM_INICIAL = {
  fecha: '',
  diaCompleto: true,
  hora_inicio: '',
  hora_fin: '',
  motivo: '',
};

export const AdminBloqueos = () => {
  const [bloqueos, setBloqueos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [borrando, setBorrando] = useState(null);
  const [recargar, setRecargar] = useState(0);

  
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await pedir('/bloqueos');
        setBloqueos(data.bloqueos);
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudieron cargar los bloqueos');
      }
    };

    cargar();
  }, [recargar]);

  
  const manejarCambios = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    setAviso('');
    setEnviando(true);

    const cuerpo = { fecha: form.fecha };
    if (!form.diaCompleto) {
      cuerpo.hora_inicio = form.hora_inicio;
      cuerpo.hora_fin = form.hora_fin;
    }
    if (form.motivo.trim()) cuerpo.motivo = form.motivo.trim();

    try {
      const data = await pedir('/bloqueos', { metodo: 'POST', cuerpo });
      setAviso(data.mensaje);
      setForm(FORM_INICIAL);
      setRecargar((r) => r + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const borrar = async (id) => {
    if (!window.confirm('¿Borrar este bloqueo? Esos horarios vuelven a quedar disponibles.')) return;

    setBorrando(id);
    setError('');
    setAviso('');

    try {
      const data = await pedir(`/bloqueos/${id}`, { metodo: 'DELETE' });
      setAviso(data.mensaje);
      setRecargar((r) => r + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBorrando(null);
    }
  };

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {aviso && <div className="alert alert-success">{aviso}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="panel">
            <h1 className="h5 mb-3">Bloquear horarios</h1>

            <form onSubmit={guardar}>
              <div className="mb-3">
                <label htmlFor="fecha" className="form-label">Día</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  className="form-control"
                  min={fechaHoy()}
                  value={form.fecha}
                  onChange={manejarCambios}
                  required
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="diaCompleto"
                  name="diaCompleto"
                  className="form-check-input"
                  checked={form.diaCompleto}
                  onChange={manejarCambios}
                />
                <label htmlFor="diaCompleto" className="form-check-label">Día completo</label>
              </div>

              {!form.diaCompleto && (
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="hora_inicio" className="form-label">Desde</label>
                    <input
                      type="time"
                      id="hora_inicio"
                      name="hora_inicio"
                      className="form-control"
                      step="1800"
                      value={form.hora_inicio}
                      onChange={manejarCambios}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="hora_fin" className="form-label">Hasta</label>
                    <input
                      type="time"
                      id="hora_fin"
                      name="hora_fin"
                      className="form-control"
                      step="1800"
                      value={form.hora_fin}
                      onChange={manejarCambios}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="motivo" className="form-label">Motivo (opcional)</label>
                <input
                  type="text"
                  id="motivo"
                  name="motivo"
                  className="form-control"
                  placeholder="Por ejemplo: Enfermedad"
                  value={form.motivo}
                  onChange={manejarCambios}
                />
              </div>

              <button type="submit" className="btn btn-marca w-100" disabled={enviando}>
                {enviando ? 'Guardando...' : 'Bloquear'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="panel">
            <h2 className="h5 mb-3">Bloqueos vigentes</h2>

            {bloqueos.length === 0 ? (
              <p className="mb-0">No hay bloqueos cargados.</p>
            ) : (
              bloqueos.map((b) => {
                const desde = formatearHora(b.fecha_hora_inicio);
                const hasta = formatearHora(b.fecha_hora_fin);
                const esDiaCompleto = desde === '09:00' && hasta === '21:00';

                return (
                  <div
                    key={b.id_bloqueo}
                    className="border border-secondary rounded p-3 mb-2 d-flex justify-content-between align-items-center flex-wrap gap-2"
                  >
                    <div>
                      <p className="mb-1 fw-bold">{formatearDia(b.fecha_hora_inicio)}</p>
                      <p className="mb-0 small">
                        {esDiaCompleto ? 'Día completo' : `De ${desde} a ${hasta}`}
                        {b.motivo && ` · ${b.motivo}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={borrando === b.id_bloqueo}
                      onClick={() => borrar(b.id_bloqueo)}
                    >
                      {borrando === b.id_bloqueo ? 'Borrando...' : 'Borrar'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};