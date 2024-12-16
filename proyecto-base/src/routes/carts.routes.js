import { Router } from "express"; // Import the Router from Express.
import { cartController } from "../controllers/cart.controller.js"; // Import the cart controller.
import { authorization } from "../middlewares/authorization.middleware.js"; // Import the authorization middleware.
import { passportCall } from "../middlewares/passport.middleware.js"; // Import the Passport middleware.

const router = Router();

// Create a new cart (admins only)
router.post("/",
  passportCall('jwt'),
  authorization("admin"),
  cartController.createCart
);

// Get cart by ID (authorized users only)
router.get("/:cid",
  passportCall('jwt'),
  authorization("user"),
  cartController.getCartById
);

// Add product to cart
router.post("/:cid/product/:pid",
  passportCall('jwt'),
  authorization("user"),
  cartController.addProductToCart
);

// Purchase products in the cart
router.post("/:cid/purchase",
  passportCall('jwt'),
  authorization("user"),
  cartController.purchaseCart
);

// Remove product from cart
router.delete("/:cid/product/:pid",
  passportCall('jwt'),
  authorization("user"),
  cartController.deleteProductToCart
);

// Update quantity of a product in the cart (authorized users only)
router.put("/:cid/product/:pid",
  passportCall('jwt'),
  authorization("user"),
  cartController.updateQuantityProductInCart
);

// Clear all products from a cart (admins only)
router.delete("/:cid",
  passportCall('jwt'),
  authorization("admin"),
  cartController.clearProductsToCart
);

// Export the router for use in the application
export default router;