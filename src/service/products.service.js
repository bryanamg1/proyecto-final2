import { productsModel } from "../dao/models/products.model.js";
import mongoose from "mongoose";

export const getAllProducts = async(req, res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10;
        const query = req.query.query || {}
        const page = parseInt(req.query.page) || 1;
        const ordenPrecio = parseInt(req.query.sort) || 1;
        const skip = (page - 1)* limit;

        const products = await productsModel.paginate(query,{skip, limit,sort:{price:ordenPrecio}})
        res.send({status:'succcess', payload: products}) 
    } catch (error) {
        console.error(error)
        res.status(500).send({error: error.message})
    }
};

export const getProductById = async (req, res)=>{
    try {
        const id = req.params.pid;
        const products = await productsModel.findById(id)
        res.send({status:'succcess', payload: products}) 
    } catch (error) {
        console.error(error)
        res.status(500).send({error: error.message})
    }
};

export const addProducts = async (req, res)=>{
    try {
        const {tittle, description, price, code, stock, thumbnails, status} = req.body;
        if(!tittle || !description || !price || !code || !stock || !thumbnails || !status){
            return res.status(400).send({status: "error", message: 'datos incompletos'})
        }else{
            const newProduct = await productsModel.create({ tittle, description, price, code, stock, thumbnails, status });
            res.status(201).send({ status: 'success', message: 'Producto creado exitosamente', product: newProduct });
        }
    } catch (error) {
        console.error(error)
    }
};

export const deleteProduct = async(req, res)=>{
    try {
        const productId = req.params.pid;

        const productById = await productsModel.findOne({_id: productId})

        if(!productById){
            return res.status(400).send('el id: '+ productId +' proporcionado no coincide con nigun producto')
        }else{
            const result = await productsModel.deleteOne({_id: productId});
            return res.status(204).send({ status: 'success', message: 'Producto eliminado exitosamente', product: result });
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("el codigo entro al catch" + error)
    }
}

