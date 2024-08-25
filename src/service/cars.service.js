import { carsModel } from "../dao/models/cars.model.js";
import { productsModel } from "../dao/models/products.model.js";
import mongoose from "mongoose";

export const getCarsById = async (req, res) => {
    try {
        const carId = req.params.cid;
        const carObjectId = new mongoose.Types.ObjectId(carId);

        const result = await carsModel.findById(carObjectId)
        .populate({
        path: 'products.product', 
        model: 'products', 
        })
        .exec();

        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send('Error obteniendo productos: ' + error);
    }
};

export const getAllCars = async (res ,req)=>{
    try {
        const allCars = await carsModel.find()
        res.send({status:"success", payload: allCars})
    } catch (error) {
        res.status(500).send('Error obteniendo productos: ' + error)
    }
};

export const createCar = async (req, res) => {
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1;

    try {
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const productExist = await productsModel.exists({ _id: productObjectId });

        if (!productExist) {
            return res.status(404).send('El producto con el ID: ' + productId + ' no existe');
        }

        const userCart = await carsModel.findOne({ 'products.product': productObjectId });

        if (!userCart) {
            const newCart = new carsModel({ products: [{ product: productObjectId, quantity: quantity }] });
            await newCart.save();
        } else {
            const productInCart = userCart.products.find(p => p.product.equals(productObjectId));

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                userCart.products.push({ product: productObjectId, quantity: quantity });
            }
            await userCart.save();
        }

        res.send({ status: 'success', payload: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo productos: ' + error.message);
    }
};

export const deleteAllProducstInCar = async (req, res) => {
    try {
        const carId = req.params.cid;
        const carObjectId = new mongoose.Types.ObjectId(carId);

        const car = await carsModel.findById(carObjectId);

        if (!car) {
            return res.status(404).send('El carrito con el ID: ' + carId + ' no existe');
        }
        car.products = [];
        await car.save();
        return res.status(204).send({ status: 'success', message: 'Productos eliminados exitosamente del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

export const deleteOneProductIncar = async (req, res) => {
    try {
        const carId = req.params.cid;
        const productId = req.params.pid;

        const carObjectId = new mongoose.Types.ObjectId(carId);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const car = await carsModel.findById(carId);
        if (!car) {
            return res.status(404).send('El carrito con el ID: ' + carId + ' no existe');
        }

        car.products = car.products.filter(product => !product.product.equals(productObjectId));

        await car.save();

        if (car.products.length === 0) {
            await carsModel.findByIdAndDelete(carObjectId);
        }

        return res.status(204).send({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const updateQuantityInCar = async (req, res) => {
    try {
        const carId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const carObjectId = new mongoose.Types.ObjectId(carId);
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const car = await carsModel.findById(carObjectId);

        if (!car) {
            return res.status(404).send('El carrito con el ID: ' + carObjectId + ' no existe');
        }

        const productIndex = car.products.findIndex(product => product.product.equals(productObjectId));

        if (productIndex === -1) {
            return res.status(404).send('El producto con el ID: ' + productObjectId + ' no existe en el carrito');
        }

        car.products[productIndex].quantity = quantity;

        await car.save();

        return res.status(200).send({ status: 'success', message: 'Cantidad de ejemplares actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

export const updateProductInCar = async (req, res) => {
    try {
        const carId = req.params.cid;
        const carObjectId = new mongoose.Types.ObjectId(carId);

        const car = await carsModel.findById(carObjectId);

        if (!car) {
            return res.status(404).send('El carrito con el ID: ' + carId + ' no existe');
        }

        const updatedProducts = req.body.products;

        if (!Array.isArray(updatedProducts) || updatedProducts.some(product => !product.productId || !product.quantity)) {
            return res.status(400).send('El formato de los productos es inválido');
        }

        car.products = updatedProducts;

        await car.save();

        return res.status(200).send({ status: 'success', message: 'Carrito actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};