import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Products";

const schema = new mongoose.Schema({
    title: {
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    code: {
        type:String,
        unique:true
    },
    price: {
        type:Number,
        require:true
    },
    status: {
        type:Boolean,
        default:true,
    },
    stock: {
        type:Number,
        default:1
    },
    category: {
        type:String,
        default:"Producto Genérico"    
    },
});

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection,schema);

export default productModel;