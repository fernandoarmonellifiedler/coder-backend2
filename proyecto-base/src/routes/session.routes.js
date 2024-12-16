import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import passport from "passport";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";
import { SessionController } from "../controllers/session.controller.js";

const sessionController = new SessionController();
const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", passportCall("register"), sessionController.register);

// Ruta para iniciar sesión
router.post("/login", passportCall("login"), sessionController.login);

// Ruta para cerrar sesión
router.get("/logout", sessionController.logout);

router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

// Ruta para autenticar con Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    session: false,
  }),
  (req, res) => {
    res.status(200).json({ status: "success", payload: req.user });
  }
);

export default router;
