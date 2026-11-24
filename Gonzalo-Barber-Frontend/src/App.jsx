import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import { Login } from './componentes/Login.jsx';
import './App.css';

function App() {

  const { usuario, setUsuario, cargando } = useContext(AuthContext);
  const [modoAdmin, setModoAdmin] = useState(false);
  
  const cerrarSesion = async () => {
    await fetch('http://localhost:3000/gonzaloBarber/auth/logout', {
    method: 'POST',
    credentials: 'include'
    });
    setUsuario(null);
    setModoAdmin(false);
  };

  if (cargando) {
    return <p className="text-white text-center mt-5">Cargando...</p>;
  }

  
  //Pantalla de bienvenida
  if (!usuario && !modoAdmin) {
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

  // Login
  if (!usuario) {
    return (
      <Login 
        onLoginSuccess={(usuarioLogueado) => {
          setUsuario(usuarioLogueado);
        }} 
        onVolver={() => setModoAdmin(false)} 
      />
    );
  }

  //Panel de Administración
  return (
    <div className="container mt-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Panel de Administración</h1>
        <button 
          className="btn btn-danger"
          onClick={cerrarSesion}
        >
          Cerrar Sesión
        </button>
      </div>
      <hr className="bg-light" />
      <p>Bienvenido, {usuario.nombre} a Gonzalo Barber.</p>
    </div>
  );
}

export default App;