import { productDao } from "../dao/mongo/product.dao.js"; // Import the product data access object for database operations.
import { productService } from "../services/product.service.js"; // Import the product service for additional product-related logic.

export class ProductController {
  // Defines the ProductController class to handle product-related HTTP requests.

  async getAll(req, res) {
    // Retrieves all products based on query parameters.
    try {
      const { limit = 10, page = 1, sort, category, status } = req.query; // Destructure limit, page, sort, category, and status from query parameters with default values.

      const options = {
        limit: Number(limit), // Convert limit to a number.
        page: Number(page), // Convert page to a number.
        sort: {
          price: sort === "asc" ? 1 : -1, // Determine sort order based on the sort query parameter.
        },
        learn: true, // Possible setting for additional behavior (depends on application logic).
      };

      // If a category is specified, filter products by category.
      if (category) {
        const products = await productDao.getAll({ category }, options); // Fetch products by category.
        return res.status(200).json({ status: "success", products }); // Respond with the products found.
      }

      // If a status is specified, filter products by status.
      if (status) {
        const products = await productDao.getAll({ status }, options); // Fetch products by status.
        return res.status(200).json({ status: "success", products }); // Respond with the products found.
      }

      // Fetch all products if no category or status is specified.
      const products = await productDao.getAll({}, options); // Fetch all products.
      res.status(200).json({ status: "success", products }); // Respond with the products found.
    } catch (error) {
      this.handleError(res, error); // Handle errors using a custom error handler.
    }
  }

  async getById(req, res) {
    // Retrieves a product by its ID.
    try {
      const { pid } = req.params; // Extracts the product ID from request parameters.
      const product = await productService.getById(pid); // Fetches the product by ID.
      if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" }); // Responds with error if product not found.

      res.status(200).json({ status: "success", product }); // Responds with the product found.
    } catch (error) {
      this.handleError(res, error); // Handle errors using a custom error handler.
    }
  }

  async deleteOne(req, res) {
    // Deletes a product by its ID.
    try {
      const { pid } = req.params; // Extracts the product ID from request parameters.
      const product = await productService.deleteOne(pid); // Deletes the product by ID.
      if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" }); // Responds with error if product not found.

      res.status(200).json({ status: "success", msg: `El producto con el id ${pid} fue eliminado` }); // Confirms deletion of the product.
    } catch (error) {
      this.handleError(res, error); // Handle errors using a custom error handler.
    }
  }

  async update(req, res) {
    // Updates a product's details.
    try {
      const { pid } = req.params; // Extracts the product ID from request parameters.
      const productData = req.body; // Retrieves the new product data from the request body.
      const product = await productDao.update(pid, productData); // Updates the product in the database.
      if (!product) return res.status(404).json({ status: "Error", msg: "Producto no encontrado" }); // Responds with error if product not found.

      res.status(200).json({ status: "success", product }); // Responds with the updated product.
    } catch (error) {
      this.handleError(res, error); // Handle errors using a custom error handler.
    }
  }

  async create(req, res) {
    // Creates a new product.
    try {
      const productData = req.body; // Retrieves the product data from the request body.
      const product = await productDao.create(productData); // Creates the product in the database.

      res.status(201).json({ status: "success", product }); // Responds with the created product and status 201.
    } catch (error) {
      this.handleError(res, error); // Handle errors using a custom error handler.
    }
  }

  handleError(res, error) {
    // Custom error handler to streamline error responses.
    console.log(error); // Logs the error for debugging purposes.
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" }); // Responds with a generic server error message.
  }
}