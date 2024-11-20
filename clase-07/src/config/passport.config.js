import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import { userDao } from "../dao/mongo/user.dao.js";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Función que inicializa todas las estrategias
export const initializePassport = () => {
  // Estrategia Local
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      // Passport local utiliza las propiedades username y password
      /* 
      "register" es el nombre de la estrategia que estamos creando.
      passReqToCallback: true, nos permite acceder a la request en la función de autenticación.
      usernameField: "email", nos permite definir el campo que usaremos como username.
      done es una función que debemos llamar cuando terminamos de procesar la autenticación.
      Nota: passport recibe dos datos el username y el password, en caso de que no tengamos un campo username en nuestro formulario, podemos usar usernameField para definir el campo que usaremos como username.
      */

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
          role: role ? role : "user",
          cart: cart._id
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

  // Estrategia de google
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: "",
        clientSecret: "",

        callbackURL: "http://localhost:8080/api/sessions/google",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { id, name, emails } = profile;

          const user = {
            first_name: name.givenName,
            last_name: name.familyName,
            email: emails[0].value,
          };

          const existingUser = await userDao.getByEmail(user.email);

          // Si existe el usuario
          if (existingUser) {
            return cb(null, existingUser);
          }

          // En caso que el usuario con ese email no este registrado, lo hacemos en este paso
          const newUser = await userDao.create(user);
          return cb(null, newUser);
        } catch (error) {
          return cb(error);
        }
      }
    )
  );

  // Estrategia JWT
  passport.use("jwt", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: "ClaveSecreta"
  },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (error) {
        return done(error);
      }
    }
  ))

};
