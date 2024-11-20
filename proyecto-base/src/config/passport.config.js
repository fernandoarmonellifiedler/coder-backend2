import passport from "passport";
import local from "passport-local";
import { userDao } from "../dao/mongo/user.dao.js";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";

const LocalStrategy = local.Strategy;

// Función que inicializa todas las estrategias
export const initializePassport = () => {
  // Estrategia Local
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      try {
        const { first_name, last_name, age, role } = req.body;
        // validar si el usuario existe
        const user = await userDao.getByEmail(username);
        // Si el usuario existe, retornamos un mensaje de error
        if (user) return done(null, false, { message: "El usuario ya existe" }); // done es equivalente a un next() en los middlewares

        // Creamos un carrito para el nuevo usuario
        const cart = await cartDao.create();

        // Si el usuario no existe creamos un nuevo usuario
        const newUser = {
          first_name,
          last_name,
          age,
          email: username,
          password: createHash(password),
          role: role ? role : "user"
        };

        const userRegister = await userDao.create(newUser);

        return done(null, userRegister);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
    try {
      const user = await userDao.getByEmail(username);

      if (!user || !isValidPassword(password, user.password)) {
        return done(null, false, { message: "Email o contraseña no válido" });
      }

      done(null, user);
    } catch (error) {
      done(error)
    }
  }))

  // Serialización y deserialización de usuarios
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

};
