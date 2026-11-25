import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import logo from '../assets/logo.jpg';


const API_URL = 'http://localhost:3000/gonzaloBarber';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const { setUsuario } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' 
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.mensaje || 'Error al iniciar sesión');
            }

            setUsuario(data.usuario);
            navigate(data.usuario.rol === 'admin' ? '/admin' : '/perfil');

        } catch (err) {
            console.error('Error de login:', err);
            setError(err.message || 'No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
            <div className="pagina justify-content-center align-items-center p-3">
                <div className="tarjeta w-100" style={{ maxWidth: '420px' }}>
                <div className="text-center mb-4">
                     <img src={logo} alt="Logo de Gonzalo Barbershop" className="rounded-circle mb-3" width="110" height="110" />
                    <h1 className="h4">Iniciá sesión</h1>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 text-center" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input 
                            type="email" 
                            className="form-control"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-marca py-2"
                            disabled={cargando}
                        >
                            {cargando ? 'Verificando...' : 'Ingresar'}
                        </button>
                        
                        <Link to="/" className="btn btn-outline-light py-2">
                            Volver al inicio
                        </Link>
                        <div className="text-center mt-2">
                            <Link to="/olvide-password" className="link-light d-block mb-1">
                                ¿Olvidaste tu contraseña?
                            </Link>
                            <Link to="/registro" className="link-light">
                                ¿No tenés cuenta? Registrate
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};