import mongoose from "mongoose";

const carsCollection = 'cars'

const carsSchema = new mongoose.Schema({
    products: [
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity:{
                type:Number,
                default: 0}
        },

        
    ]
})

export const carsModel = mongoose.model(carsCollection, carsSchema);