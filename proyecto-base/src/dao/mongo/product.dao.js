import { productModel } from "./models/product.model.js"; // Import the product model for database interactions.

class ProductDao {
  // Class responsible for data access operations related to products.

  // Method to get all products with pagination options
  async getAll(query, options) {
    // Retrieves a paginated list of products based on the provided query and options.
    const products = await productModel.paginate(query, options);
    return products; // Returns the paginated products.
  }

  // Method to get a product by its ID
  async getById(id) {
    // Fetches a product document from the database based on the given ID.
    const product = await productModel.findById(id);
    return product; // Returns the found product or null if not found.
  }

  // Method to create a new product
  async create(data) {
    // Creates a new product document in the database using the provided data.
    const product = await productModel.create(data);
    return product; // Returns the created product document.
  }

  // Method to update a product by its ID
  async update(id, data) {
    // Updates an existing product document with the provided data based on the given ID.
    const productUpdate = await productModel.findByIdAndUpdate(id, data, { new: true });
    return productUpdate; // Returns the updated product document.
  }

  // Method to logically delete a product by its ID
  async deleteOne(id) {
    // Deactivates a product document in the database by setting its status to false.
    const product = await productModel.findByIdAndUpdate(id, { status: false }, { new: true });
    return product; // Returns the deactivated product document.
  }
}

// Instantiate the ProductDao class and export it for use in other parts of the application.
export const productDao = new ProductDao();