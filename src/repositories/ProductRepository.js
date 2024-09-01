export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts() {
    return this.dao.get();
  }

  getPaginatedProducts(params) {
    return this.dao.paginate(params);
  }

  getProductById(id) {
    return this.dao.getOne({ _id: id });
  }

  find(params, operation) {
    return this.dao.find(params, operation);
  }

  updateById(params, operation) {
    return this.dao.updateOne(params, operation);
  }

  createProduct(product) {
    return this.dao.create(product);
  }

  updateStock(id, newStock) {
    return this.dao.updateOne({ _id: id }, { $set: { stock: newStock } });
  }

  deleteProduct(id) {
    return this.dao.deleteOne({ _id: id });
  }
}
