import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import logo from '../assets/logo.jpg';

const API_URL = 'http://localhost:3000/gonzaloBarber';

export const Registro = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmar: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const { confirmar, ...datos } = form;
    if (datos.telefono === '') {
      delete datos.telefono;
    }

    setCargando(true);
    try {
      const respuestaRegistro = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        credentials: 'include'
      });
      const dataRegistro = await respuestaRegistro.json();
      if (!respuestaRegistro.ok) {
        throw new Error(dataRegistro.mensaje || 'No se pudo crear la cuenta');
      }

      const respuestaLogin = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
        credentials: 'include'
      });
      const dataLogin = await respuestaLogin.json();
      if (!respuestaLogin.ok) {
        navigate('/login');
        return;
      }

      setUsuario(dataLogin.usuario);
      navigate('/perfil');
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pagina justify-content-center align-items-center p-3">
      <div className="tarjeta w-100 my-4" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo de Gonzalo Barbershop" className="rounded-circle mb-3" width="90" height="90" />
          <h1 className="h4">Registro de usuario</h1>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input id="nombre" name="nombre" type="text" className="form-control"
                value={form.nombre} onChange={handleChange} required maxLength={100} />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input id="apellido" name="apellido" type="text" className="form-control"
                value={form.apellido} onChange={handleChange} required maxLength={100} />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input id="email" name="email" type="email" className="form-control" placeholder="tu@email.com"
              value={form.email} onChange={handleChange} required maxLength={100} />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input id="password" name="password" type="password" className="form-control" placeholder="••••••••"
              value={form.password} onChange={handleChange} required minLength={8} maxLength={72} />
            <div className="form-text text-white-50">Entre 8 y 72 caracteres.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="confirmar" className="form-label">Repetí la contraseña</label>
            <input id="confirmar" name="confirmar" type="password" className="form-control" placeholder="••••••••"
              value={form.confirmar} onChange={handleChange} required minLength={8} maxLength={72} />
          </div>

          <div className="mb-4">
            <label htmlFor="telefono" className="form-label">Teléfono (opcional)</label>
            <input id="telefono" name="telefono" type="tel" className="form-control" placeholder="3865123456"
              value={form.telefono} onChange={handleChange} pattern="\d{8,15}"
              title="Solo números, entre 8 y 15 dígitos, sin espacios ni guiones" />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-marca py-2" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'REGISTRARSE'}
            </button>
            <Link to="/" className="btn btn-outline-light py-2">
              Volver al inicio
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link to="/login" className="link-light">
              ¿Ya tenés cuenta? Iniciá sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};