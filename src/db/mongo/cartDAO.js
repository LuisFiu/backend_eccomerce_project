import cartModel from "./models/cart.model.js";

export default class cartDAO {
  async get() {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      return null;
    }
  }

  async getOne(params) {
    try {
      const cart = await cartModel.findOne(params);
      return this.populate(cart, "products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async find(params, operation) {
    try {
      const cart = await cartModel.find(params, operation);
      return cart;
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async create() {
    try {
      const cart = await cartModel.create({ products: [] });
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error);
      return -1;
    }
  }

  async populate(data, operation) {
    try {
      return data.populate(operation);
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async updateOne(params, operation) {
    try {
      const cart = await cartModel.findOneAndUpdate(params, operation);
      return cart;
    } catch (error) {
      return null;
    }
  }
}
