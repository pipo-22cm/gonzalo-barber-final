import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL, STOCK_MINIMO } from '../../constantes.js';
import { fechaHoy, formatearHora } from '../../utils/fechas.js';
import { pedir } from '../../utils/api.js';


const COLOR_ESTADO = {
  pendiente: 'bg-secondary',
  confirmado: 'bg-success',
  completado: 'bg-primary',
  cancelado: 'bg-danger',
};


export const AdminInicio = () => {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const hoy = fechaHoy();

        
        const [dTurnos, dVentasHoy, dPedidos, dProductos] = await Promise.all([
          pedir(`/turnos?fecha=${hoy}`),
          pedir(`/ventas?fecha=${hoy}`),
          pedir('/ventas?estado=pendiente&tipo=web'),
          pedir('/productos/todos'),
        ]);

        setDatos({
          turnos: dTurnos.turnos,
          cobradoHoy: dVentasHoy.totalCobrado,
          pedidosWeb: dPedidos.ventas.length,
          stockBajo: dProductos.productos.filter((p) => p.estado && p.stock < STOCK_MINIMO),
        });
      } catch (err) {
        console.error(err);
        setError(err.message || 'No se pudieron cargar los datos');
      }
    };

    cargar();
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!datos) return <p>Cargando...</p>;

  
  const turnosDelDia = datos.turnos
    .filter((t) => t.estado !== 'cancelado')
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

  const contar = (estado) => turnosDelDia.filter((t) => t.estado === estado).length;

  const metricas = [
    {
      titulo: 'Turnos de hoy',
      valor: turnosDelDia.length,
      detalle: `${contar('pendiente')} pendientes · ${contar('confirmado')} confirmados · ${contar('completado')} completados`,
    },
    {
      titulo: 'Cobrado hoy',
      valor: `$${Number(datos.cobradoHoy).toLocaleString('es-AR')}`,
      detalle: 'Ventas completadas',
    },
    {
      titulo: 'Pedidos web por cobrar',
      valor: datos.pedidosWeb,
      detalle: 'Pendientes de retiro',
    },
    {
      titulo: 'Stock bajo',
      valor: datos.stockBajo.length,
      detalle: `Productos con menos de ${STOCK_MINIMO} unidades`,
      alerta: datos.stockBajo.length > 0,
    },
  ];

  return (
    <>
      <div className="row g-3 mb-4">
        {metricas.map((m) => (
          <div className="col-12 col-sm-6 col-lg-3" key={m.titulo}>
            <div className={`panel h-100 ${m.alerta ? 'border border-danger' : ''}`}>
              <p className="small mb-1">{m.titulo}</p>
              <p className="display-6 fw-bold mb-1">{m.valor}</p>
              <p className="small mb-0 text-white-50">{m.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Agenda de hoy</h2>
          <Link to="/admin/agenda" className="btn btn-outline-light btn-sm">Ver agenda</Link>
        </div>

        {turnosDelDia.length === 0 ? (
          <p className="mb-0">No hay turnos para hoy</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {turnosDelDia.map((t) => (
                  <tr key={t.id_turno}>
                    <td>{formatearHora(t.fecha_hora)}</td>
                    <td>{t.usuarios?.nombre} {t.usuarios?.apellido}</td>
                    <td>{t.servicios?.nombre}</td>
                    <td><span className={`badge ${COLOR_ESTADO[t.estado]}`}>{t.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};