import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const productController = new ProductController();
const router = Router();

router.get("/",  productController.getAll);

router.get("/:pid", productController.getById);

router.delete("/:pid", productController.deleteOne);

router.put("/:pid", productController.update);

router.post("/", checkProductData, productController.create);
export default router;
