import express  from "express";
import carsRouter from "./routers/cars.router.js";
import productsRouter from "./routers/products.router.js"
import mongoose from "mongoose";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/api/cars', carsRouter);
app.use('/api/products', productsRouter);

try{
    await mongoose.connect('mongodb+srv://bryanamg181:<db_password>@cluster0.kzb6uge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('base de datos conectada')
}catch(error){
    console.log(error)
}

app.listen(8080);