import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    tittle: String,
    description: String,
    price: Number,
    code: {
        type: String,
        unique: true,
        index: true
    },
    stock: Number,
    thumbnails:{
        type: Array,
        default:[]
    },
    status: {
        type: Boolean,
        default: true
    }
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection,productsSchema);