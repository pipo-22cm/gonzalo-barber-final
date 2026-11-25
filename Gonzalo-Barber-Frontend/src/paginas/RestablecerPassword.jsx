import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const API_URL = 'http://localhost:3000/gonzaloBarber';

export const RestablecerPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/auth/restablecer-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || 'No se pudo cambiar la contraseña');
      }

      setMensaje(data.mensaje);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pagina justify-content-center align-items-center p-3">
      <div className="tarjeta w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo de Gonzalo Barbershop" className="rounded-circle mb-3" width="90" height="90" />
          <h1 className="h4">Elegí tu contraseña nueva</h1>
        </div>

        {!token ? (
          <div className="alert alert-danger text-center" role="alert">
            El enlace no es válido. Pedí uno nuevo.
          </div>
        ) : mensaje ? (
          <div className="alert alert-success text-center" role="status">
            {mensaje}<br />Te llevamos al inicio de sesión...
          </div>
        ) : (
          <>
            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña nueva</label>
                <input id="password" type="password" className="form-control"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={8} maxLength={72} />
                <div className="form-text text-white-50">Entre 8 y 72 caracteres.</div>
              </div>

              <div className="mb-4">
                <label htmlFor="confirmar" className="form-label">Repetí la contraseña</label>
                <input id="confirmar" type="password" className="form-control"
                  value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
                  required minLength={8} maxLength={72} />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-marca py-2" disabled={cargando}>
                  {cargando ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="text-center mt-3">
          {mensaje ? (
            <Link to="/login" className="link-light">Ir a iniciar sesión</Link>
          ) : (
            <Link to="/olvide-password" className="link-light">Pedir un enlace nuevo</Link>
          )}
        </div>
      </div>
    </div>
  );
};