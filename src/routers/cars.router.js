import { Router } from "express";
import { getAllCars,getCarsById,createCar,deleteAllProducstInCar,deleteOneProductIncar,updateProductInCar,updateQuantityInCar } from "../service/cars.service.js";

const router = Router();

router.get('/:cid', getCarsById);

router.get('/', getAllCars)


router.post('/', createCar);

router.delete('/:cid',deleteAllProducstInCar);

router.delete('/:cid/products/:pid',deleteOneProductIncar);

router.put('/:cid/products/:pid', updateQuantityInCar);

router.put('/:cid', updateProductInCar);

export default router