import { CategoriaModel } from '../models/categoriaModel.js';

export class CategoriaController{
    static async listarCategorias (req,res){
        
            const categorias = await CategoriaModel.todasLasCategorias();
            return res.status(200).json({
                categorias: categorias
            })
    }

    static async obtenerPorId (req,res){
        
            const id = Number(req.params.id)
            if(!Number.isInteger(id)){
                return res.status(400).json({mensaje:'El id no es un número valido' })
            }

            const categoria = await CategoriaModel.categoriaPorId(id)
            if(!categoria){
                return res.status(404).json({mensaje:'La categoria no existe' })
            }

            return res.status(200).json({categoria: categoria})
    }

    static async crearCategoria (req,res){
        
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
    }

    static async actualizarCategoria (req,res){

            const id = Number(req.params.id)
            
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
                mensaje: 'Categoria actualizada con éxito',
                categoria: categoriaActualizada
            })
    }

    static async borrarCategoria (req,res){
        
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
    }
}