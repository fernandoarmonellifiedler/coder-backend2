import { Router } from "express";
import { userDao } from "../dao/user.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userDao.getAll();

    res.status(200).json({ status: "ok", users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await userDao.getById(id);

    res.status(200).json({ status: "ok", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const user = await userDao.update(id, body);

    res.status(200).json({ status: "ok", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userDao.delete(id);

    res.status(200).json({ status: "ok", message: "User deleted"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const user = await userDao.create(body);

    res.status(200).json({ status: "ok", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

export default router;