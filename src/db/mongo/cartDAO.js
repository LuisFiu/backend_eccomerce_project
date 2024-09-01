import cartModel from "./models/cart.model.js";
import productModel from "./models/product.model.js";

export default class cartDAO {
  async get() {
    try {
      const carts = await cartModel.find();
      if ((carts = [])) {
        return -4;
      }
      return carts;
    } catch (error) {
      return null;
    }
  }

  async getOne(params) {
    try {
      const carts = await this.get();

      if (carts === -1) {
        return -1;
      }

      const cart = await cartModel.findOne(params);

      if (cart === null) {
        return -2;
      }

      return cart.populate("products.product");
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

  async addProduct(id, pid, qty) {
    try {
      const cart = await cartModel.findOne({ _id: id });
      if (!cart) {
        return -2;
      }

      const foundProduct = await productModel.findOne({ _id: pid });
      if (!foundProduct) {
        return -3;
      }

      const productInCart = cart.products.find((p) => p.product.equals(pid));

      if (productInCart) {
        await cartModel.findOneAndUpdate(
          { _id: id, "products.product": pid },
          { $inc: { "products.$.quantity": qty } }
        );
      } else {
        await cartModel.findOneAndUpdate(
          { _id: id },
          { $push: { products: { product: pid, quantity: qty } } }
        );
      }

      const updatedCart = await cartModel.findOne({ _id: id });

      return updatedCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async update(id, updatedValues) {
    try {
      const carts = await this.get();

      if (carts === -1) {
        return -4;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        return -2;
      }

      const productIds = updatedValues.map((product) => product.product);

      const foundProducts = await productModel.find({
        _id: { $in: productIds },
      });

      if (foundProducts.length !== productIds.length) {
        return -3;
      }

      const updatedCart = await cartModel.updateOne(
        { _id: id },
        { $set: { products: updatedValues } }
      );

      const finalCart = await cartModel.findOne({ _id: id });

      return finalCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async delete(id, pid) {
    try {
      const carts = await this.get();

      if (carts === -1) {
        return -4;
      }

      const cart = await cartModel.findOne({ _id: id });

      if (cart === null) {
        return -2;
      }

      const productInCart = await cartModel.findOne({
        _id: id,
        "products.product": pid,
      });

      if (!productInCart) {
        return -5;
      }

      const newCart = await cartModel.updateOne(
        { _id: id },
        { $pull: { products: { product: pid } } }
      );

      const updatedCart = await cartModel.findOne({ _id: id });

      return updatedCart.populate("products.product");
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async clear(params) {
    try {
      const carts = await this.get();

      if (carts === -1) {
        return -4;
      }

      const cart = await cartModel.findOne(params);

      if (cart === null) {
        return -2;
      }

      await cartModel.updateOne({ _id: params }, { $set: { products: [] } });

      const updatedCart = await cartModel.findOne(params);

      return updatedCart.populate("products.product");
    } catch (error) {
      return null;
    }
  }
}
