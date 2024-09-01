import userModel from "./models/user.model.js";

export default class usersDAO {
  async getOne(params) {
    const user = await userModel.findOne(params);
    return user;
  }

  async create(data) {
    const newUser = await userModel.create(data);
    return newUser;
  }
}
