import { Router } from "express";
import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import sessionRouter from "./session.routes.js";
import mailRouter from "./email.routes.js"
const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);
router.use("/sessions", sessionRouter);
router.use("/email", mailRouter);


export default router;
