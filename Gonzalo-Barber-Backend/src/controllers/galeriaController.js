import { unlink } from 'node:fs/promises' //Unlink , Funcion que borra un archivo del disco
import path from 'node:path'
import { GaleriaModel } from '../models/galeriaModel.js'

export class GaleriaController {

    static async listarImagenes(req, res) {
        const imagenes = await GaleriaModel.listarImagenes()
        return res.status(200).json({ imagenes })
    }

    static async subirImagen(req, res) {
        if (!req.file) {
            return res.status(400).json({ mensaje: 'Tenés que subir una imagen' })
        }

        const imagen = await GaleriaModel.crearImagen({
            imagen_url: `/uploads/galeria/${req.file.filename}`,
            descripcion: req.body.descripcion
        })

        return res.status(201).json({ mensaje: 'Imagen subida con éxito', imagen })
    }

    static async editarDescripcion(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensaje: 'El id no es un número válido' })
        }

        const imagen = await GaleriaModel.imagenPorId(id)
        if (!imagen) {
            return res.status(404).json({ mensaje: 'La imagen no existe' })
        }

        const imagenActualizada = await GaleriaModel.actualizarDescripcion(id, req.body.descripcion)
        return res.status(200).json({ mensaje: 'Descripción actualizada con éxito', imagen: imagenActualizada })
    }

    static async eliminarImagen(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensaje: 'El id no es un número válido' })
        }

        const imagen = await GaleriaModel.imagenPorId(id)
        if (!imagen) {
            return res.status(404).json({ mensaje: 'La imagen no existe' })
        }

        await GaleriaModel.eliminarImagen(id)

        try {
            await unlink(path.join(process.cwd(), imagen.imagen_url))
        } catch (error) {
            if (error.code !== 'ENOENT') throw error
        }

        return res.status(200).json({ mensaje: 'Imagen eliminada con éxito' })
    }
}