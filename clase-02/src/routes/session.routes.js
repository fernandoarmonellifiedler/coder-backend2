import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { checkEmail } from "../middlewares/checkEmail.middleware.js";

const router = Router();

router.post("/register", checkEmail, async (req, res) => {
  try {
    const body = req.body;

    const user = await userDao.create(body);
    if (!user)
      return res
        .status(400)
        .json({ status: "error", msg: "No se pudo crear el usuario" });

    res.status(201).json({ status: "success", payload: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        email,
        first_name: "Admin",
        role: "admin",
      };
      return res
        .status(200)
        .json({ status: "success", payload: req.session.user });
    }

    const user = await userDao.getByEmail(email);
    if (!user || user.password !== password)
      return res
        .status(403)
        .json({ status: "error", msg: "Email o contraseña no válido" });

    req.session.user = {
      email,
      first_name: user.first_name,
      role: "user",
    };

    res.status(200).json({ status: "success", payload: req.session.user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: "success", msg: "Session cerrada" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/current", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user)
      return res
        .status(404)
        .json({ status: "error", msg: "Usuario no logueado" });

    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

export default router;
