import { ProductoModel } from '../models/productoModel.js';
import { CategoriaModel } from '../models/categoriaModel.js';


export class ProductoController {
    static async listarCatalogo(req,res){

            const { nombre,categoria_id } = req.query
            let categoriaId = undefined

            if(categoria_id !== undefined && categoria_id !== ''){
                categoriaId = Number(categoria_id);

            if (!Number.isInteger(categoriaId) || categoriaId < 1) {
                return res.status(400).json({ mensaje: "La categoría debe ser un número entero mayor o igual a 1" });
                }
            }

            const productos = await ProductoModel.listarProductos({
                nombre,
                categoria_id: categoriaId,
                soloActivos: true,
            });
            return res.status(200).json({ productos });
        }
    
    
    static async listarTodos(req, res) {
            const { nombre, categoria_id } = req.query
            let categoriaId = undefined

            if (categoria_id !== undefined && categoria_id !== '') {
                categoriaId = Number(categoria_id)
            
                if (!Number.isInteger(categoriaId) || categoriaId < 1) {
                    return res.status(400).json({ mensaje: 'La categoría debe ser un número entero mayor o igual a 1' })
                }
            }
        
            const productos = await ProductoModel.listarProductos({
                nombre,
                categoria_id: categoriaId,
                soloActivos: false
            })
            return res.status(200).json({ productos });
    }

    static async obtenerPorId(req, res) {
            const id = Number(req.params.id)
            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' })
            }

            const producto = await ProductoModel.productoPorId(id)
            if (!producto || !producto.estado) {
                return res.status(404).json({ mensaje: 'El producto no existe' })
            }

            return res.status(200).json({ producto });
    }

    static async crearProducto(req, res) {
            const categoria = await CategoriaModel.categoriaPorId(req.body.categoria_id)
            if (!categoria) {
                return res.status(400).json({ mensaje: 'La categoría no existe' })
            }

            const producto = await ProductoModel.crearProducto(req.body)
            return res.status(201).json({
                mensaje: 'Producto creado con éxito',
                producto
            })
    }

    static async actualizarProducto(req, res) {
            const id = Number(req.params.id)
            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' })
            }

            const producto = await ProductoModel.productoPorId(id)
            if (!producto) {
                return res.status(404).json({ mensaje: 'El producto no existe' })
            }

            if (req.body.categoria_id !== undefined) {
                const categoria = await CategoriaModel.categoriaPorId(req.body.categoria_id)
                if (!categoria) {
                    return res.status(400).json({ mensaje: 'La categoría no existe' })
                }
            }

            const productoActualizado = await ProductoModel.actualizarProducto(id, req.body)
            return res.status(200).json({
                mensaje: 'Producto actualizado con éxito',
                producto: productoActualizado
            })
    }
    
    static async darDeBajaProducto(req, res) {
            const id = Number(req.params.id)
            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' })
            }

            const producto = await ProductoModel.productoPorId(id)
            if (!producto) {
                return res.status(404).json({ mensaje: 'El producto no existe' })
            }

            if (!producto.estado) {
                return res.status(409).json({ mensaje: 'El producto ya estaba dado de baja' })
            }

            await ProductoModel.darDeBajaProducto(id)
            return res.status(200).json({ mensaje: 'Producto dado de baja con éxito' })
    }

    static async reactivarProducto(req, res) {
            const id = Number(req.params.id)
            if (!Number.isInteger(id)) {
                return res.status(400).json({ mensaje: 'El id no es un número válido' })
            }

            const producto = await ProductoModel.productoPorId(id)
            if (!producto) {
                return res.status(404).json({ mensaje: 'El producto no existe' })
            }

            if (producto.estado) {
                return res.status(409).json({ mensaje: 'El producto ya está activo' })
            }

            await ProductoModel.reactivarProducto(id)
            return res.status(200).json({ mensaje: 'Producto reactivado con éxito' })
    }


}

    


    


