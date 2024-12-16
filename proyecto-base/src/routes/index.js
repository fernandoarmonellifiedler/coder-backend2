import { Router } from "express"; // Import the Router from Express.
import productsRouter from "./products.routes.js"; // Import the products routes.
import cartsRouter from "./carts.routes.js"; // Import the carts routes.
import sessionRouter from "./session.routes.js"; // Import the session routes.

const router = Router(); // Initialize a new router.

// Define routes for products, carts, and sessions
router.use("/products", productsRouter); // Routes related to products.
router.use("/carts", cartsRouter); // Routes related to shopping carts.
router.use("/sessions", sessionRouter); // Routes related to user sessions.

// Export the main router for use in the application
export default router;