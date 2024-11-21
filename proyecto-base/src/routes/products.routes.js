import { Router } from "express";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { productDao } from "../dao/mongo/product.dao.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

// Ruta para obtener productos con filtros y paginación (solo admin)
router.get("/", isAdmin, async (req, res) => {
  const { limit = 10, page = 1, sort = "desc", category, status } = req.query;

  const options = {
    limit,
    page,
    sort: {
      price: sort === "asc" ? 1 : -1, // Orden ascendente o descendente por precio
    },
    learn: true, // Parametro adicional no usado, se asume que es parte de la configuración
  };

  try {
    // Filtrado por categoría o estado, si se proporciona
    let products;
    if (category) {
      products = await productDao.getAll({ category }, options);
    } else if (status) {
      products = await productDao.getAll({ status }, options);
    } else {
      products = await productDao.getAll({}, options); // Si no hay filtros, obtenemos todos
    }

    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para obtener un producto específico por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) {
      return res.status(404).json({ status: "error", msg: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productDao.deleteOne(pid);
    if (!product) {
      return res.status(404).json({ status: "error", msg: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", msg: `Producto con ID ${pid} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const productData = req.body;

  try {
    const updatedProduct = await productDao.update(pid, productData);
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", msg: "Producto no encontrado" });
    }
    res.status(200).json({ status: "success", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para crear un nuevo producto
router.post("/", checkProductData, async (req, res) => {
  const productData = req.body;

  try {
    const newProduct = await productDao.create(productData);
    res.status(201).json({ status: "success", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

export default router;
