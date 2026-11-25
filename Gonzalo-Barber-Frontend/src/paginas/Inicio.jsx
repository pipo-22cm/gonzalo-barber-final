import { Link } from 'react-router-dom';
import { Encabezado } from '../componentes/Encabezado.jsx';
import { PiePagina } from '../componentes/PiePagina.jsx';
import './Inicio.css';
import logo from '../assets/logo.jpg';

export const Inicio = () => {
  return (
    <div className="inicio text-white">
      <Encabezado />

      <main className="inicio-hero py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-4">
              <img src={logo} alt="Logo de Gonzalo Barbershop" className="inicio-logo" />
            </div>

            <div className="col-12 col-md-8">
              <div className="inicio-cartel">
                <h1 className="display-5 mb-3">Expertos en Estilo y Tradición</h1>
                <p className="mb-4">
                  Reserva tu servicio hoy mismo y vive la experiencia en Gonzalo Barbershop.
                </p>
                <Link to="/login" className="btn btn-marca btn-lg px-5">
                  INGRESAR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PiePagina />
    </div>
  );
};