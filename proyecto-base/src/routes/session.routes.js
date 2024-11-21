import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import passport from "passport";
import { createToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", passportCall("register"), async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario registrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para iniciar sesión
router.post("/login", passportCall("login"), async (req, res) => {
  try {
    // Generamos el token y lo guardamos en una cookie
    const token = createToken(req.user);
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para cerrar sesión
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ status: "success", msg: "Sesión cerrada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para obtener los datos del usuario actual
router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

// Ruta para autenticar con Google
router.get("/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  session: false,
}), (req, res) => {
  try {
    res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Error interno del servidor" });
  }
});

export default router;
