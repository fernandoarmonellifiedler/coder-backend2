import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const cartController = new CartController();
const router = Router();

router.post("/", authorization("admin"), cartController.createCart);

router.get("/:cid", authorization("user"), cartController.getCartById);

router.post("/:cid/product/:pid", authorization("user"), cartController.addProductToCart);

router.delete("/:cid/product/:pid", authorization("user"), cartController.deleteProductToCart);

router.put("/:cid/product/:pid", authorization("user"), cartController.updateQuantityProductInCart);

router.delete("/:cid", authorization("admin"), cartController.clearProductsToCart);

export default router;
