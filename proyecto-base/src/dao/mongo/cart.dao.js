import { cartModel } from "./models/cart.model.js"; // Import the cart model for database interactions.

class CartDao {
  // Class to handle data access operations for shopping carts.

  // Method to get all carts
  async getAll() {
    // Retrieves all cart documents from the database.
    const carts = await cartModel.find();
    return carts; // Returns the retrieved carts.
  }

  // Method to get a cart by its ID
  async getById(id) {
    // Fetches a cart document from the database based on the given ID.
    const cart = await cartModel.findById(id);
    return cart; // Returns the found cart or null if not found.
  }

  // Method to create a new cart
  async create() {
    // Creates a new cart document in the database with default values.
    const cart = await cartModel.create({});
    return cart; // Returns the created cart document.
  }

  // Method to update a cart by its ID
  async update(id, data) {
    // Updates an existing cart document with the provided data based on the given ID.
    const cartUpdate = await cartModel.findByIdAndUpdate(id, data, { new: true });
    return cartUpdate; // Returns the updated cart document.
  }

  // Method to delete a cart by its ID
  async deleteOne(id) {
    // Deletes a cart document from the database based on the given ID.
    const cart = await cartModel.deleteOne({ _id: id });
    return cart; // Returns the result of the delete operation.
  }
}

// Instantiate the CartDao class and export it for use in other parts of the application.
export const cartDao = new CartDao();