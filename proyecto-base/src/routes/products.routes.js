import { Router } from "express"; // Import the Router from Express.
import { ProductController } from "../controllers/product.controller.js"; // Import the ProductController.
import { checkProductData } from "../middlewares/checkProductData.middleware.js"; // Import the middleware to check product data.
import { passportCall } from "../middlewares/passport.middleware.js"; // Import the Passport authentication middleware.
import { authorization } from "../middlewares/authorization.middleware.js"; // Import the authorization middleware.

const productController = new ProductController(); // Instantiate the ProductController.
const router = Router(); // Initialize a new router.

// Get all products
router.get("/", productController.getAll); // Retrieve a list of all products.

// Get a product by ID
router.get("/:pid", productController.getById); // Retrieve a single product by its ID.

// Delete a product (admin only)
router.delete("/:pid",
  passportCall('jwt'),
  authorization('admin'),
  productController.deleteOne
); // Admin route to delete a product by ID.

// Update a product (admin only)
router.put("/:pid",
  passportCall('jwt'),
  authorization('admin'),
  productController.update
); // Admin route to update product details by ID.

// Create a new product (admin only)
router.post("/",
  checkProductData,
  passportCall('jwt'),
  authorization('admin'),
  productController.create
); // Route to create a new product after validating data.

export default router; // Export the router for use in the application.