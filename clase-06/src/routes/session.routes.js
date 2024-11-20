import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { checkEmail } from "../middlewares/checkEmail.middleware.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import passport from "passport";
import { createToken, verifyToken } from "../utils/jwt.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      res.status(201).json({ status: "success", msg: "Usuario Registrado" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "Error", msg: "Error interno del servidor" });
    }
  }
);

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

router.get("/current", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id);

    res.status(200).json({ status: "Success", payload: user })
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
  }),
  (req, res) => {
    res.status(200).json({ status: "success", payload: req.user });
  }
);

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await userDao.getByEmail(email);
  // Valida si existe el usuario o si el password no es el mismo que el que tenemos registrado en la base de datos
  if (!user || !isValidPassword(password, user.password)) {
    return res
      .status(401)
      .json({ status: "error", msg: "Email o contraseña no válido" });
  }

  // Generamos el token
  const token = createToken(user);

  // Guardamos el token en una cookie
  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({ status: "success", payload: { user, token } });
});

export default router;
