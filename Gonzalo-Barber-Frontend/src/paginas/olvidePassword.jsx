import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const API_URL = 'http://localhost:3000/gonzaloBarber';

export const OlvidePassword = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/auth/olvide-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.mensaje || 'No se pudo enviar el enlace');
      }

      setMensaje(data.mensaje);
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
          <h1 className="h4">¿Olvidaste tu contraseña?</h1>
          <p className="text-white-50 mb-0">Escribí tu email y te mandamos un enlace para elegir una nueva.</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">{error}</div>
        )}

        {mensaje ? (
          <div className="alert alert-success text-center" role="status">{mensaje}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input id="email" type="email" className="form-control" placeholder="tu@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={100} />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-marca py-2" disabled={cargando}>
                {cargando ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-3">
          <Link to="/login" className="link-light">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};