import { userModel } from "./models/user.model.js";

class UserDao {
  async getAll() {
    return await userModel.find();
  }

  async getById(id) {
    return await userModel.findById(id);
  }

  async create(userData) {
    return await userModel.create(userData)
  }

  async update(id, data) {
    return await userModel.findByIdAndUpdate(id, data)
  }

  async delete(id) {
    return await userModel.findByIdAndDelete(id)
  }
}

export const userDao = new UserDao();