import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },

  lastName: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    unique: true,
    require: true,
    index: true,
  },

  birthDate: {
    type: Date,
    require: false,
  },

  password: {
    type: String,
    require: true,
  },

  cartId: {
    type: String,
  },

  role: {
    type: String,
    require: true,
    default: "user",
  },
});

const userModel = new mongoose.model(collection, schema);

export default userModel;
