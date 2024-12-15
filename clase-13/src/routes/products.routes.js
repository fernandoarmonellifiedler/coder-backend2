import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { checkProductData } from "../middlewares/checkProductData.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const productController = new ProductController();
const router = Router();

router.get("/",  productController.getAll);

router.get("/:pid", productController.getById);

router.delete("/:pid", passportCall('jwt'), authorization('admin'), productController.deleteOne);

router.put("/:pid", passportCall('jwt'), authorization('admin'), productController.update);

router.post("/", checkProductData, passportCall('jwt'), authorization('admin'), productController.create);
export default router;
