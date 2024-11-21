import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import passport from "passport";
import { createToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  try {
    return res.status(201).json({ status: "success", message: "Usuario registrado" });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

router.post("/login", passportCall("login"), async (req, res) => {
  try {
    // Generar token y almacenarlo en una cookie
    const token = createToken(req.user);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ status: "success", message: "Sesión cerrada" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id);
    return res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.error("Current User Error:", error);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

export default router;
