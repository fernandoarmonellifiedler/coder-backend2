import passport from "passport";
import local from "passport-local";
import { userDao } from "../dao/mongo/user.dao.js";
import { createHash } from "../utils/hashPassword.js";

const LocalStrategy = local.Strategy;

// Función que inicializa todas las estrategias
export const initializePassport = () => {
  // Estrategia Local
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        // Passport local utiliza las propiedades username y password
        /* 
      "register" es el nombre de la estrategia que estamos creando.
      passReqToCallback: true, nos permite acceder a la request en la función de autenticación.
      usernameField: "email", nos permite definir el campo que usaremos como username.
      done es una función que debemos llamar cuando terminamos de procesar la autenticación.
      Nota: passport recibe dos datos el username y el password, en caso de que no tengamos un campo username en nuestro formulario, podemos usar usernameField para definir el campo que usaremos como username.
      */

        try {
          const { first_name, last_name, age } = req.body;
          // validar si el usuario existe
          const user = await userDao.getByEmail(username);
          // Si el usuario existe, retornamos un mensaje de error
          if (user)
            return done(null, false, { message: "El usuario ya existe" }); // done es equivalente a un next() en los middlewares

          // Si el usuario no existe creamos un nuevo usuario
          const newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password),
          };

          const userRegister = await userDao.create(newUser);

          return done(null, userRegister);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización y deserialización de usuarios
  /* 
  La serialización y deserialización de usuarios es un proceso que nos permite almacenar y recuperar información del usuario en la sesión.
  La serialización es el proceso de convertir un objeto de usuario en un identificador único.
  La deserialización es el proceso de recuperar un objeto de usuario a partir de un identificador único.
  Los datos del user se almacenan en la sesión y se recuperan en cada petición.
  */

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
