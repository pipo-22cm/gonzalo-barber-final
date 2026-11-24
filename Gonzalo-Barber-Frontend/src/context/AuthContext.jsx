import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider ({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

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
    <AuthContext.Provider value={{ usuario, setUsuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}