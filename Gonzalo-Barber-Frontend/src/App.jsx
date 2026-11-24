import { useContext } from 'react';
import { Routes , Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { Inicio } from './paginas/Inicio.jsx';
import { Login } from './paginas/Login.jsx';
import { PanelAdmin } from './paginas/PanelAdmin.jsx';
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
      <Route path='/admin' element={<PanelAdmin/>}/>
    </Routes>
  )
  
}

export default App;