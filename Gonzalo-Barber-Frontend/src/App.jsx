import { useContext } from 'react';
import { Routes , Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { RutaProtegida } from './componentes/RutaProtegida.jsx';
import { Inicio } from './paginas/Inicio.jsx';
import { Login } from './paginas/Login.jsx';
import { Registro } from './paginas/Registro.jsx';
import { OlvidePassword } from './paginas/OlvidePassword.jsx';
import { RestablecerPassword } from './paginas/RestablecerPassword.jsx';
import { Reservar } from './paginas/Reservar.jsx';
import { PanelAdmin } from './paginas/PanelAdmin.jsx';
import { Perfil } from './paginas/Perfil.jsx';
import { AdminInicio } from './paginas/admin/AdminInicio';
import { AdminAgenda } from './paginas/admin/AdminAgenda';
import { AdminBloqueos } from './paginas/admin/AdminBloqueos';
import { NoEncontrada } from './paginas/NoEncontrada.jsx';
import './App.css';

function App() {

  const { cargando } = useContext(AuthContext);
 
  if (cargando) {
    return <p className="text-white text-center mt-5">Cargando...</p>;
  }

  return (
    <Routes>

      <Route path='/' element={<Inicio/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path="/registro" element={<Registro />} />
      <Route path="/olvide-password" element={<OlvidePassword />} />
      <Route path="/restablecer-password" element={<RestablecerPassword />} />
      <Route path='/admin' element={<RutaProtegida rol="admin"><PanelAdmin /></RutaProtegida>}>
        <Route index element={<AdminInicio />}/>
        <Route path="agenda" element={<AdminAgenda />}/>
        <Route path="bloqueos" element={<AdminBloqueos />}/>
      </Route>
      <Route path="/perfil" element={
        <RutaProtegida>
          <Perfil />
        </RutaProtegida>
      } />
      <Route path="/reservar" element={<Reservar />} />
      <Route path='*' element={<NoEncontrada/>}/>
    </Routes>
  )
  
}

export default App;