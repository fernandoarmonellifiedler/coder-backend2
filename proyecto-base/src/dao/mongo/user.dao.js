import { userModel } from "./models/user.model.js"; // Import the user model for database interactions.

class UserDao {
  // Class responsible for data access operations related to users.

  // Method to get all users
  async getAll() {
    // Retrieves all user documents from the database.
    const users = await userModel.find();
    return users; // Returns the retrieved users.
  }

  // Method to get a user by their ID
  async getById(id) {
    // Fetches a user document from the database based on the provided ID.
    const user = await userModel.findById(id);
    return user; // Returns the found user or null if not found.
  }

  // Method to get a user by their email
  async getByEmail(email) {
    // Retrieves a user document based on the provided email and populates the associated cart.
    const user = await userModel.findOne({ email }).populate("cart");
    return user; // Returns the found user or null if not found.
  }

  // Method to create a new user
  async create(data) {
    // Creates a new user document in the database using the provided data.
    const user = await userModel.create(data);
    return user; // Returns the created user document.
  }

  // Method to update a user by their ID
  async update(id, data) {
    // Updates an existing user document with the provided data based on the given ID.
    const userUpdate = await userModel.findByIdAndUpdate(id, data, { new: true });
    return userUpdate; // Returns the updated user document.
  }

  // Method to delete a user by their ID
  async deleteOne(id) {
    // Deletes a user document from the database based on the provided ID.
    const user = await userModel.deleteOne({ _id: id });
    return user; // Returns the result of the delete operation.
  }
}

// Instantiate the UserDao class and export it for use in other parts of the application.
export const userDao = new UserDao();