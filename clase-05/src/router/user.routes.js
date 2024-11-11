import { Router } from "express";
import { userDao } from "../dao/user.dao.js";

const router = Router();

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