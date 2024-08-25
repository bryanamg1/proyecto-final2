import { Router } from "express";
import { getAllProducts , getProductById, addProducts, deleteProduct} from "../service/products.service.js";

const router = Router()

router.get('/', getAllProducts)

router.get('/:pid', getProductById)

router.post('/',addProducts)

router.delete('/:pid', deleteProduct)

export default router