import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

// Crear un carrito nuevo (solo admins)
router.post("/", authorization("admin"), cartController.createCart);

// Obtener carrito por ID (solo usuarios autorizados)
router.get("/:cid", authorization("user"), cartController.getCartById);

// Añadir producto al carrito
router.post("/:cid/product/:pid", authorization("user"), cartController.addProductToCart);

// Eliminar producto del carrito
router.delete("/:cid/product/:pid", authorization("user"), cartController.deleteProductToCart);

// Actualizar cantidad de producto en el carrito (solo usuarios autorizados)
router.put("/:cid/product/:pid", authorization("user"), cartController.updateQuantityProductInCart);

// Eliminar todos los productos de un carrito (solo admins)
router.delete("/:cid", authorization("admin"), cartController.clearProductsToCart);

export default router;
