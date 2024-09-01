export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCartById(id) {
    return this.dao.getOne({ _id: id });
  }

  populate(data) {
    return this.dao.populate(data, "products.product");
  }

  find(params, operation) {
    return this.dao.find(params, operation);
  }

  createCart() {
    return this.dao.create();
  }

  updateById(params, operation) {
    return this.dao.updateOne(params, operation);
  }

  addProductById(id, pid, qty) {
    return this.dao.addProduct(id, pid, qty);
  }

  replaceProducts(id, updatedValues) {
    return this.dao.replace(id, updatedValues);
  }

  deleteProduct(id, pid) {
    return this.dao.delete(id, pid);
  }

  clearCart(id) {
    return this.dao.updateOne({ _id: id }, { $set: { products: [] } });
  }
}
