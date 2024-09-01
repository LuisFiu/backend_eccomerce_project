import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
  },
  purchase_datetime: {
    type: Date,
    require: false,
  },
  amount: {
    type: String,
    unique: false,
  },
  purchaser: {
    type: String,
    require: false,
  },
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
