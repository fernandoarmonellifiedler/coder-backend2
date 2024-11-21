import { Router } from "express";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { productDao } from "../dao/mongo/product.dao.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";

const router = Router();

// Middleware global para rutas que requieren autenticación JWT
router.use(passportCall("jwt")); 

// Crear un carrito nuevo (solo admins)
router.post("/", authorization("admin"), async (req, res) => {
  try {
    const cart = await cartDao.create();
    res.status(201).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Obtener carrito por ID (solo usuarios autorizados)
router.get("/:cid", authorization("user"), async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartDao.getById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", msg: "Carrito no encontrado" });
    }
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Añadir producto al carrito (solo usuarios autorizados)
router.post("/:cid/product/:pid", authorization("user"), async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) {
      return res.status(404).json({ status: "error", msg: `Producto no encontrado: ${pid}` });
    }

    const cart = await cartDao.getById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", msg: `Carrito no encontrado: ${cid}` });
    }

    const updatedCart = await cartDao.addProductToCart(cid, pid);
    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Eliminar producto del carrito (solo usuarios autorizados)
router.delete("/:cid/product/:pid", authorization("user"), async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) {
      return res.status(404).json({ status: "error", msg: `Producto no encontrado: ${pid}` });
    }

    const cart = await cartDao.getById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", msg: `Carrito no encontrado: ${cid}` });
    }

    const updatedCart = await cartDao.deleteProductToCart(cid, pid);
    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Actualizar cantidad de producto en el carrito (solo usuarios autorizados)
router.put("/:cid/product/:pid", authorization("user"), async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const product = await productDao.getById(pid);
    if (!product) {
      return res.status(404).json({ status: "error", msg: `Producto no encontrado: ${pid}` });
    }

    const cart = await cartDao.getById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", msg: `Carrito no encontrado: ${cid}` });
    }

    const updatedCart = await cartDao.updateQuantityProductInCart(cid, pid, Number(quantity));
    res.status(200).json({ status: "success", payload: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Eliminar todos los productos de un carrito (solo admins)
router.delete("/:cid", authorization("admin"), async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartDao.clearProductsToCart(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", msg: "Carrito no encontrado" });
    }
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

export default router;
