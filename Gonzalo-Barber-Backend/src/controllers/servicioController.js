import { ServicioModel } from '../models/servicioModel.js';

export class ServicioController {

    static async listarActivos (req,res){

            const listarActivos = await ServicioModel.listarActivosServicio();
            return res.status(200).json({
                servicios: listarActivos
            })   
    }

    static async listarTodos (req,res){
        
            const listarTodos = await ServicioModel.listarTodosServicio();
            return res.status(200).json({
                servicios: listarTodos
            })    
    }
    
    static async obtenerPorId (req, res) {

            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }

            const servicio = await ServicioModel.buscarPorIdServicio(id);

            if (!servicio || !servicio.estado) {
                return res.status(404).json({ 
                mensaje: 'El servicio no existe o está dado de baja'
            });
            }

            return res.status(200).json({ 
                servicio: servicio 
            });
    }

    static async crearServicio (req, res) {
       
            const {nombre, descripcion, precio, duracion} = req.body
            
            const nuevoServicio = await ServicioModel.crearServicio({
                nombre,
                descripcion,
                precio,
                duracion
            })

            return res.status(201).json({
                mensaje: 'Servicio creado con éxito',
                servicio: nuevoServicio
            })
    }

    static async actualizarServicio (req,res){
        
             const id = Number(req.params.id);
             const datos = req.body

            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }

            const servicio = await ServicioModel.buscarPorIdServicio(id);
            if (!servicio){
                return res.status(404).json({ 
                mensaje: 'El servicio no existe'
                })
            }

            const servicioActualizado = await ServicioModel.actualizarServicio(id,datos)

            return res.status(200).json({
                mensaje: 'Servicio actualizado con éxito',
                servicio: servicioActualizado
            })

    }

    static async bajaServicio (req, res){

            const id = Number(req.params.id)
            if (!Number.isInteger(id)){
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }
            
            const servicio = await ServicioModel.buscarPorIdServicio(id);
            if (!servicio){
                return res.status(404).json({ 
                mensaje: 'El servicio no existe'
                })
            }

             if (!servicio.estado) {
            return res.status(409).json({ mensaje: 'El servicio ya estaba dado de baja' });
            }

             const bajaServicio = await ServicioModel.darDeBajaServicio(id)
            
                return res.status(200).json({ 
                mensaje: 'Servicio dado de baja con éxito',
                servicio: bajaServicio
                });
    }

    static async reactivarServicio(req, res) {
            const id = Number(req.params.id)
            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' })
            }
        
            const servicio = await ServicioModel.buscarPorIdServicio(id)
            if (!servicio) {
                return res.status(404).json({ mensaje: 'El servicio no existe' })
            }
        
            if (servicio.estado) {
                return res.status(409).json({ mensaje: 'El servicio ya está activo' })
            }
        
            const servicioReactivado = await ServicioModel.reactivarServicio(id)
            return res.status(200).json({
                mensaje: 'Servicio reactivado con éxito',
                servicio: servicioReactivado
            })
    }
    
}