export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts() {
    return this.dao.get();
  }

  getProductById(id) {
    return this.dao.getOne({ _id: id });
  }

  createProduct(product) {
    return this.dao.create(product);
  }

  editProduct(id, updatedValues) {
    return this.dao.replace(id, updatedValues);
  }

  updateStock(id, newStock) {
    return this.dao.update({ _id: id }, { $set: { stock: newStock } });
  }

  deleteProduct(id) {
    return this.dao.delete({ _id: id });
  }
}
