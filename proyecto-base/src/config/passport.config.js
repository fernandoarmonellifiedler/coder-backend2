import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import { userDao } from "../dao/mongo/user.dao.js";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";
import envsConfig from "./envs.config.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Función que inicializa todas las estrategias
export const initializePassport = () => {
  // Estrategia de registro local
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;

          // Verificar si el usuario ya existe
          const existingUser = await userDao.getByEmail(username);

          // Si el usuario existe, retornamos un mensaje de error
          if (existingUser) {
            return done(null, false, { message: "El usuario ya existe" }); // done es equivalente a un next() en los middlewares
          }

          // Crear carrito para el nuevo usuario
          const cart = await cartDao.create();

          // Si el usuario no existe creamos un nuevo usuario
          const newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: createHash(password), // Encriptar el password
            role: role ? role : "user",
            cart: cart._id
          };

          const userRegister = await userDao.create(newUser);

          return done(null, userRegister);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de inicio de sesión local
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userDao.getByEmail(username);

        // Valida si existe el usuario o si el password no es el mismo que el que tenemos registrado en la base de datos
        if (!user || !isValidPassword(password, user.password)) {
          return done(null, false, { message: "Email o contraseña inválido" });
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

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

  // Estrategia de google

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: envsConfig.GOOGLE_CLIENT_ID,
        clientSecret: envsConfig.GOOGLE_CLIENT_SECRET,

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

          // Si el usuario ya existe
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

  // Estrategia de autenticación con JWT
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "ClaveSecreta",
      },
      async (jwk_payload, done) => {
        try {
          return done(null, jwk_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
