const aTexto = (fecha) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

export const fechaHoy = () => aTexto(new Date());

export const sumarDias = (fecha, dias) => {
  const d = new Date(`${fecha}T00:00:00`)
  d.setDate(d.getDate() + dias);           
  return aTexto(d);
};

export const formatearDia = (fechaHora) =>
  new Date(fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

export const formatearHora = (fechaHora) =>
  new Date(fechaHora).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });