import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const productController = new ProductController();
const router = Router();

// Ruta para obtener productos con filtros y paginación (solo admin)
router.get("/", isAdmin, productController.getAll);

// Ruta para obtener un producto específico por ID
router.get("/:pid", productController.getById);

// Ruta para eliminar un producto por ID
router.delete("/:pid", productController.deleteOne);

// Ruta para actualizar un producto por ID
router.put("/:pid", productController.update);

// Ruta para crear un nuevo producto
router.post("/", checkProductData, productController.create);
export default router;
