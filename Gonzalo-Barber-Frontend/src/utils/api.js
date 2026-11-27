import { API_URL } from '../constantes';


export const pedir = async (ruta, { metodo = 'GET', cuerpo } = {}) => {
  const opciones = { method: metodo, credentials: 'include' };

  if (cuerpo) {
    opciones.headers = { 'Content-Type': 'application/json' };
    opciones.body = JSON.stringify(cuerpo);
  }

  const res = await fetch(`${API_URL}${ruta}`, opciones);
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje);
  return data;
};