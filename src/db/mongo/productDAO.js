import productModel from "./models/product.model.js";

export default class productDAO {
  async get() {
    try {
      const products = await productModel.find();
      if ((products = [])) {
        return -1;
      }
      return products;
    } catch (error) {
      return null;
    }
  }

  async create(product) {
    try {
      const newProduct = await productModel.create(product);
      if (!newProduct) {
        return -1;
      }
      return newProduct;
    } catch (error) {
      return -1;
    }
  }

  async replace(id, updatedValues) {
    try {
      const products = await this.get();

      if (products === -1) {
        console.log({
          status: "error",
          message: "Product list is empty, try creating a product first",
        });
        return -1;
      }

      const foundProduct = await productModel.findOne({ _id: id });

      if (foundProduct === null) {
        console.log({ status: "error", message: "Product doesn't exist" });
        return -2;
      }

      const product = await productModel.updateOne(
        { _id: id },
        { $set: updatedValues }
      );

      console.log({
        status: "success",
        message: "Product updated successfully",
        product: foundProduct,
      });

      const updatedProduct = await productModel.findOne({ _id: id });

      return { oldValues: foundProduct, newValues: updatedProduct };
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async update(params, operation) {
    try {
      const products = await this.get();

      if (products === -1) {
        return -1;
      }

      const foundProduct = await productModel.findOne(params);

      if (foundProduct === null) {
        return -2;
      }

      const product = await productModel.updateOne(params, operation);

      console.log({
        status: "success",
        message: "Product updated successfully",
        product: foundProduct,
      });

      const updatedProduct = await productModel.findOne(params);

      return { oldValues: foundProduct, newValues: updatedProduct };
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async delete(params) {
    try {
      const products = await this.get();

      if (products === -1) {
        return -1;
      }

      const foundProduct = await productModel.findOne(params);

      if (foundProduct === null) {
        return -2;
      }

      const product = await productModel.deleteOne(params);

      console.log({
        status: "success",
        message: "Product deleted successfully",
        product: foundProduct,
      });

      return foundProduct;
    } catch (error) {
      console.log({ status: "error", message: "An error occurred", error });
      return null;
    }
  }

  async getOne(params) {
    try {
      const products = await this.get();

      if (products === -1) {
        return -1;
      }

      const product = await productModel.findOne(params);

      if (!product || product.length === 0) {
        return -2;
      }

      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
      return null;
    }
  }
}
