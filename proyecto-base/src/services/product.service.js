import { productDao } from "../dao/mongo/product.dao.js"; // Import the product data access object.
import { ProductResponseDto } from "../dto/productResponse.dto.js"; // Import the product response data transfer object (DTO).

class ProductService {
  // Retrieves all products based on a query and options
  async getAll(query, options) {
    return await productDao.getAll(query, options); // Delegate retrieval to the product DAO.
  }

  // Retrieves a product by its ID
  async getById(id) {
    const product = await productDao.getById(id); // Fetch the product using its ID.
    if (!product) return null; // Return null if the product does not exist.
    
    // Format the product using the ProductResponseDto for consistent response structure
    const productFormat = new ProductResponseDto(product); 
    return productFormat; // Return the formatted product.
  }

  // Deletes a product by its ID
  async deleteOne(id) {
    const product = await productDao.getById(id); // Check if the product exists.
    if (!product) return null; // Return null if the product does not exist.
    
    await productDao.deleteOne(id); // Delegate deletion to the product DAO.
    return true; // Return true to indicate successful deletion.
  }

  // Updates a product's details
  async update(id, data) {
    const product = await productDao.getById(id); // Fetch the product by ID.
    if (!product) return null; // Return null if the product does not exist.

    const productUpdate = await productDao.update(id, data); // Update the product using the DAO.
    return productUpdate; // Return the updated product information.
  }

  // Creates a new product
  async create(data) {
    const product = await productDao.create(data); // Delegate creation to the product DAO.
    return product; // Return the created product information.
  }
}

// Export a singleton instance of ProductService for use in the application.
export const productService = new ProductService();