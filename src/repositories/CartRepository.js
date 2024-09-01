export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCartById(id) {
    return this.dao.getOne({ _id: id });
  }

  createCart() {
    return this.dao.create();
  }

  addProductById(id, pid, qty) {
    return this.dao.addProduct(id, pid, qty);
  }

  replaceProducts(id, updatedValues) {
    return this.dao.update(id, updatedValues);
  }

  deleteProduct(id, pid) {
    return this.dao.delete(id, pid);
  }

  clearCart(id) {
    return this.dao.clear({ _id: id });
  }
}
