import React, { useState } from 'react';

const API_URL = 'http://localhost:3000/gonzaloBarber';

export const Login = ({ onLoginSuccess, onVolver }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

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

            onLoginSuccess(data.usuario);

        } catch (err) {
            console.error('Error de login:', err);
            setError(err.message || 'No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4 bg-dark text-white" style={{ width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-warning">Gonzalo Barber</h2>
                    <p className="text-muted">Panel de Administración</p>
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
                            className="form-control bg-secondary text-white border-0" 
                            placeholder="admin@barber.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control bg-secondary text-white border-0" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-warning fw-bold text-dark py-2"
                            disabled={cargando}
                        >
                            {cargando ? 'Verificando...' : 'Ingresar'}
                        </button>
                        
                        {onVolver && (
                            <button 
                                type="button" 
                                className="btn btn-outline-light py-2" 
                                onClick={onVolver}
                            >
                                Volver al inicio
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};