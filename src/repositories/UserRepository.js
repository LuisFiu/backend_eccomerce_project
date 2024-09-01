export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUserbyEmail(email) {
    return this.dao.getOne({ email: email });
  }

  getUser(id) {
    return this.dao.getOne({ _id: id });
  }

  createUser(data) {
    return this.dao.create(data);
  }
}
