import { ServicioModel } from '../models/servicioModel.js';


export class ServicioController {

    static async listarActivos (req,res){
        try{
            const listarActivos = await ServicioModel.listarActivosServicio();
            return res.status(200).json({
                servicios: listarActivos
            })
            
        }catch(error){
            console.error('Error al traer servicios activos:', error);
            return res.status(500).json({ 
                mensaje: 'Error al traer servicios activos, por favor intente mas tarde.'
             })
        }
    }

    static async listarTodos (req,res){
        try{
            const listarTodos = await ServicioModel.listarTodosServicio();
            return res.status(200).json({
                servicios: listarTodos
            })
            
        }catch(error){
            console.error('Error al traer todos los servicios:', error);
            return res.status(500).json({ 
                mensaje: 'Error al traer los servicios, por favor intente mas tarde.'
             })
        }
    }
    
    static async obtenerPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' });
            }

            const servicio = await ServicioModel.buscarPorIdServicio(id);

            if (!servicio) {
                return res.status(404).json({ 
                mensaje: 'El servicio no existe'
            });
            }

            return res.status(200).json({ 
                servicios: servicio 
            });

        } catch (error) {
            console.error('Error al traer el servicio:', error);
            return res.status(500).json({
                mensaje: 'Error al traer el servicio, por favor intente más tarde.'
            });
        }
    }

    static async crearServicio (req, res) {
        try{
            const {nombre, descripcion, precio, duracion, estado} = req.body
            
            const nuevoServicio = await ServicioModel.crearServicio({
                nombre,
                descripcion,
                precio,
                duracion,
                estado
            })

            return res.status(201).json({
                mensaje: 'Servicio creado con éxito',
                servicio: nuevoServicio
            })

        }catch(error){
            console.error('Error al registrar servicio:', error);
            return res.status(500).json({ 
                mensaje: 'Error al registrar servicio, por favor intente mas tarde.'
             })
        }
    }

    static async actualizarServicio (req,res){
        try{
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
                mensaje: 'Servicio actualizado con éxito:',
                servicio: servicioActualizado
            })

        }catch(error){
            console.error('Error al actualizar servicio:', error);
            return res.status(500).json({ 
                mensaje: 'Error al actualizar servicio, por favor intente mas tarde.'
             })
        }
    }




}