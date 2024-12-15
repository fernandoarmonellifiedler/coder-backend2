import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";

// const cartController = new CartController();
const router = Router();

router.post("/", authorization("admin"), cartController.createCart);

router.get("/:cid", authorization("user"), cartController.getCartById);

router.post("/:cid/product/:pid", cartController.addProductToCart);

router.delete("/:cid/product/:pid", cartController.deleteProductToCart);

router.put("/:cid/product/:pid", authorization("user"), cartController.updateQuantityProductInCart);

router.delete("/:cid", authorization("admin"), cartController.clearProductsToCart);

export default router;
