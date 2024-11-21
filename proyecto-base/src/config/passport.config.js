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

export const initializePassport = () => {
  // Estrategia de registro local
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;

          // Verificar si el usuario ya existe
          const existingUser = await userDao.getByEmail(email);
          if (existingUser) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          // Crear carrito para el nuevo usuario
          const cart = await cartDao.create();

          // Crear nuevo usuario
          const newUser = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            role: role || "user",
            cart: cart._id
          };

          const userCreated = await userDao.create(newUser);
          return done(null, userCreated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de inicio de sesión local
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await userDao.getByEmail(email);

        if (!user || !isValidPassword(password, user.password)) {
          return done(null, false, { message: "Email o contraseña inválido" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialización y deserialización de usuarios
  passport.serializeUser((user, done) => done(null, user._id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  // Estrategia de autenticación con Google
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: "557836612939-t2sua3gqdguhk94shnnapangmkhcse1q.apps.googleusercontent.com", // Agrega tu clientID
        clientSecret: "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", // Agrega tu clientSecret
        callbackURL: "http://localhost:8080/api/sessions/google",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, emails } = profile;
          const email = emails[0]?.value;

          const existingUser = await userDao.getByEmail(email);

          // Si el usuario ya existe
          if (existingUser) {
            return done(null, existingUser);
          }

          // Crear un nuevo usuario
          const newUser = await userDao.create({
            first_name: name?.givenName || "",
            last_name: name?.familyName || "",
            email,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error);
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
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
