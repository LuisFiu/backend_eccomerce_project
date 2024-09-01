import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: [
      {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId,
            select: false
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number,
            required: true
        }
      }
    ]
  });

schema.plugin(mongoosePaginate);

const cartModel = mongoose.model(collection,schema);

export default cartModel;