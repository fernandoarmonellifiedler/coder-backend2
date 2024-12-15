import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { checkEmail } from "../middlewares/checkEmail.middleware.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import passport from "passport";

const router = Router();

router.post("/register", passport.authenticate("register"), async (req, res) => {
  try {
    
    res.status(201).json({status: "success", msg: "Usuario Registrado"});
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
    // Valida si existe el usuario o si el password no es el mismo que el que tenemos registrado en la base de datos
    if (!user || !isValidPassword(password, user.password)) {
      return res
        .status(401)
        .json({ status: "error", msg: "Email o contraseña no válido" });
    }

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
