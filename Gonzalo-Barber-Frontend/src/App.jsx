import React, { useState } from 'react';
import { Login } from './componentes/Login.jsx';
import './App.css';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [modoAdmin, setModoAdmin] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  // 1. Landing Page / Pantalla de Bienvenida
  if (!modoAdmin) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white text-center p-3">
        <h1 className="display-4 fw-bold mb-3 text-warning">Gonzalo Barbershop</h1>
        <p className="lead mb-4">Expertos en Estilo y Tradición</p>
        <button 
          className="btn btn-warning btn-lg fw-bold px-5 text-dark"
          onClick={() => setModoAdmin(true)}
        >
          INGRESAR
        </button>
      </div>
    );
  }

  // 2. Módulo de Login
  if (!logueado) {
    return (
      <Login 
        onLoginSuccess={(usuario) => {
          setUsuarioActual(usuario);
          setLogueado(true);
        }} 
        onVolver={() => setModoAdmin(false)} 
      />
    );
  }

  // 3. Panel de Administración
  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
        <button 
          className="btn btn-danger"
          onClick={() => {
            setLogueado(false);
            setModoAdmin(false);
            setUsuarioActual(null);
          }}
        >
          Cerrar Sesión
        </button>
      </div>
      <hr className="bg-light" />
      <p>Bienvenido, {usuarioActual?.nombre || 'Administrador'}. Conectado a MySQL.</p>
    </div>
  );
}

export default App;