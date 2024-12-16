import { request, response } from "express"; // Import request and response objects from Express.
import { productDao } from "../dao/mongo/product.dao.js"; // Import the product data access object.

export const checkProductData = async (req = request, res = response, next) => {
  // Middleware to validate product data before creation or update.
  try {
    const { title, description, price, code, stock, category } = req.body; // Destructure product details from the request body.
    
    const newProduct = {
      title,
      description,
      price,
      code,
      stock,
      category,
    };

    // Fetch all existing products to validate the new product data.
    const products = await productDao.getAll();
    
    // Check for duplicate product code.
    const productExists = products.docs.find((p) => p.code === code);
    if (productExists) {
      // If a product with the same code is found, respond with a 400 Bad Request status.
      return res.status(400).json({ 
        status: "error", 
        msg: `The product with the code ${code} already exists`
      });
    }

    // Validate that all required fields are provided.
    const isAnyFieldMissing = Object.values(newProduct).includes(undefined);
    if (isAnyFieldMissing) {
      // If any required field is missing, respond with a 400 Bad Request status.
      return res.status(400).json({ 
        status: "error", 
        msg: "All fields are mandatory"
      });
    }

    // Proceed to the next middleware or route handler if validation passes.
    next();
  } catch (error) {
    // Log the error for debugging purposes.
    console.log(error);
    
    // Respond with a 500 Internal Server Error status for unexpected errors.
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};