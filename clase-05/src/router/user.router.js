import { Router } from "express";
import userRouter from "./user.router";

const router = Router();

router.use("/user", userRouter());

router.post("/register", async (req, res) => {
    try {

        //const { name, lastName, email, password } = req.body;

        const user = await userDao.create(req.body);

        res.status(201).json({ status: "ok", payload: user })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", msg: "Internal Server Error" });
    }
});

export default router;