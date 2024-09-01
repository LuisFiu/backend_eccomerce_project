import productModel from "./models/product.model.js";

export default class productDAO {
  async get() {
    try {
      return productModel.find();
    } catch (error) {
      return null;
    }
  }

  async getOne(params) {
    try {
      return await productModel.findOne(params);
    } catch (error) {
      return null;
    }
  }

  async paginate(params) {
    try {
      return productModel.paginate(
        {},
        { page: parseInt(params) || 1, limit: 5, lean: true }
      );
    } catch (error) {
      return null;
    }
  }

  async find(params, operation) {
    try {
      return await productModel.find(params, operation);
    } catch (error) {
      return null;
    }
  }

  async create(product) {
    try {
      return await productModel.create(product);
    } catch (error) {
      return null;
    }
  }

  async updateOne(params, operation) {
    try {
      return productModel.updateOne(params, operation);
    } catch (error) {
      console.log({ error: error });
      return null;
    }
  }

  async deleteOne(params) {
    return await productModel.deleteOne(params);
  }
  catch(error) {
    return null;
  }
}
