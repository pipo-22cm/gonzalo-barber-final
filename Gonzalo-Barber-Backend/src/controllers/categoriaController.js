import { CategoriaModel } from '../models/categoriaModel.js';

export class CategoriaController{
    static async listarCategorias (req,res){
        try{
            const categorias = await CategoriaModel.todasLasCategorias();
            return res.status(200).json({
                categorias: categorias
            })

        }catch(error){
            console.error('Error al traer las categorias:', error);
            return res.status(500).json({ 
                mensaje: 'Error al traer las categorias, por favor intente mas tarde.'
             })
        }
    }

    static async obtenerPorId (req,res){
        try{
            const id = Number(req.params.id)
            if(!Number.isInteger(id)){
                return res.status(400).json({mensaje:'El id no es un número valido' })
            }

            const categoria = await CategoriaModel.categoriaPorId(id)
            if(!categoria){
                return res.status(404).json({mensaje:'La categoria no existe' })
            }

            return res.status(200).json({categoria: categoria})
        }catch(error){
            console.error('Error al traer la categoria:', error);
            return res.status(500).json({ 
                mensaje: 'Error al traer la categoria, por favor intente mas tarde.'
             })
        }
    }

    static async crearCategoria (req,res){
        try{
            const {nombre} = req.body
            const existente = await CategoriaModel.categoriaPorNombre(nombre)
            if (existente) {
                return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' })
            }
            
            const nuevaCategoria = await CategoriaModel.crearCategoria({
                nombre
            })

            return res.status(201).json({
                mensaje: 'Categoria creada con éxito',
                categoria: nuevaCategoria 
            })
        }catch(error){
            console.error('Error al crear la categoria:', error);
            return res.status(500).json({ 
                mensaje: 'Error al crear la categoria, por favor intente mas tarde.'
             })
        }
    }

    static async actualizarCategoria (req,res){
        try{
            const id = Number(req.params.id)
            const datos = req.body
            if(!Number.isInteger(id)){
                return res.status(400).json({mensaje:'El id no es un número valido' })
            }

            const categoria = await CategoriaModel.categoriaPorId(id);
            if(!categoria){
                return res.status(404).json({mensaje:'La categoria no existe' })
            }

            const { nombre } = req.body
            const existente = await CategoriaModel.categoriaPorNombre(nombre)
            if (existente && existente.id_categoria !== id) {
                return res.status(409).json({ mensaje: 'Ya existe una categoría con ese nombre' })
            }

            const categoriaActualizada = await CategoriaModel.actualizarCategoria(id,{nombre})
            return res.status(200).json({
                mensaje: 'Categoria actualizada con éxito:',
                categoria: categoriaActualizada
            })
        }catch(error){
            console.error('Error al actualizar la categoria:', error);
            return res.status(500).json({ 
                mensaje: 'Error al actualizar la categoria, por favor intente mas tarde.'
             })
        }
    }

    static async borrarCategoria (req,res){
        try{
            const id = Number(req.params.id)
            if(!Number.isInteger(id)){
                return res.status(400).json({mensaje:'El id no es un número valido' })
            }

            const categoria = await CategoriaModel.categoriaPorId(id);
            if(!categoria){
                return res.status(404).json({mensaje:'La categoria no existe' })
            }

             const cantidadProductos = await CategoriaModel.contarProductos(id)
            if (cantidadProductos > 0) {
                return res.status(409).json({
                    mensaje: `No se puede eliminar: la categoría tiene ${cantidadProductos} producto(s). Primero pasalos a otra categoría o eliminalos`
                })
            }

            await CategoriaModel.eliminarCategoria(id)
            return res.status(200).json({ mensaje: 'Categoría eliminada con éxito' })
        }catch(error){
            console.error('Error al eliminar la categoria:', error);
            return res.status(500).json({ 
                mensaje: 'Error al eliminar la categoria, por favor intente mas tarde.'
             })
        }


    }
}