import { useContext } from 'react';
import { Routes , Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { RutaProtegida } from './componentes/RutaProtegida.jsx';
import { Inicio } from './paginas/Inicio.jsx';
import { Login } from './paginas/Login.jsx';
import { PanelAdmin } from './paginas/PanelAdmin.jsx';
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
      <Route path='/admin' element={
        <RutaProtegida rol="admin">
          <PanelAdmin />
        </RutaProtegida>
      }/>
      <Route path='*' element={<NoEncontrada/>}/>
    </Routes>
  )
  
}

export default App;