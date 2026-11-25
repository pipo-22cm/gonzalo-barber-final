import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

export function AuthProvider ({ children }) {
  
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const navigate = useNavigate()

   const cerrarSesion = async () => {
    await fetch('http://localhost:3000/gonzaloBarber/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    setUsuario(null);
    navigate('/');
  };



  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/gonzaloBarber/usuarios/perfil', {
          credentials: 'include'
        })

        if (respuesta.ok) {
          const data = await respuesta.json()
          setUsuario(data.usuario)
        }
      } catch (error) {
        console.error('No se pudo verificar la sesión:', error)
      } finally {
        setCargando(false)
      }
    }

    verificarSesion()
  }, [])

   return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}