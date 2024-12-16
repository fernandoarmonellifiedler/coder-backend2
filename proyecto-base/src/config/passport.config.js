import passport from "passport"; // Import passport for authentication management.
import local from "passport-local"; // Import local strategy for username/password login.
import google from "passport-google-oauth20"; // Import Google OAuth strategy.
import jwt from "passport-jwt"; // Import JWT strategy for token-based authentication.
import { userDao } from "../dao/mongo/user.dao.js"; // User data access object for database operations.
import { cartDao } from "../dao/mongo/cart.dao.js"; // Cart data access object for database operations.
import { createHash, isValidPassword } from "../utils/hashPassword.js"; // Utility functions for password hashing and validation.
import { cookieExtractor } from "../utils/cookieExtractor.js"; // Utility to extract JWT from cookies.
import envsConfig from "./envs.config.js"; // Environment configuration for sensitive data.

const LocalStrategy = local.Strategy; // Alias for local strategy.
const GoogleStrategy = google.Strategy; // Alias for Google strategy.
const JWTStrategy = jwt.Strategy; // Alias for JWT strategy.
const ExtractJWT = jwt.ExtractJwt; // Extractor for JWT payload.

export const initializePassport = () => {
  // Initializes and configures passport strategies.

  // Local registration strategy
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      try {
        const { first_name, last_name, age, role } = req.body; // Destructure user details from the request body.

        // Check if the user already exists
        const existingUser = await userDao.getByEmail(username);
        if (existingUser) return done(null, false, { message: "El usuario ya existe" }); // User already exists.

        // Create a new cart for the user
        const cart = await cartDao.create();

        // Create a new user object
        const newUser = {
          first_name,
          last_name,
          age,
          email: username,
          password: createHash(password), // Encrypt the password.
          role: role || "user", // Default role to "user" if not provided.
          cart: cart._id, // Associate the new cart with the user.
        };

        const registeredUser = await userDao.create(newUser); // Save the new user in the database.
        return done(null, registeredUser); // Successfully created user.
      } catch (error) {
        return done(error); // Handle any errors during registration.
      }
    })
  );

  // Local login strategy
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userDao.getByEmail(username); // Fetch user by email.
        
        // Validate user's existence and password match
        if (!user || !isValidPassword(password, user.password)) {
          return done(null, false, { message: "Email o contraseña inválido" }); // Invalid email or password.
        }
        
        done(null, user); // Successfully authenticated user.
      } catch (error) {
        done(error); // Handle any errors during login.
      }
    })
  );

  // User serialization and deserialization
  passport.serializeUser((user, done) => {
    done(null, user._id); // Serialize the user ID for session management.
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id); // Fetch the user by ID.
      done(null, user); // Successfully deserialized the user.
    } catch (error) {
      done(error); // Handle errors in deserialization.
    }
  });

  // Google authentication strategy
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: envsConfig.GOOGLE_CLIENT_ID, // Google client ID from environment config.
        clientSecret: envsConfig.GOOGLE_CLIENT_SECRET, // Google client secret from environment config.
        callbackURL: "https://localhost:8080/api/sessions/google", // Redirect URL after authentication.
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { id, name, emails } = profile; // Destructure profile information.
          const user = {
            first_name: name.givenName, // User's first name.
            last_name: name.familyName, // User's last name.
            email: emails[0].value, // User's email.
          };

          const existingUser = await userDao.getByEmail(user.email); // Check if the user already exists.
          if (existingUser) {
            return cb(null, existingUser); // User already exists.
          }

          // Register the new user if they do not exist
          const newUser = await userDao.create(user); // Create new user in the database.
          return cb(null, newUser); // Successfully registered new user.
        } catch (error) {
          return cb(error); // Handle any errors during Google authentication.
        }
      }
    )
  );

  // JWT authentication strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), // Extract JWT from cookies.
        secretOrKey: envsConfig.JWT_KEY, // Secret key for validating the token.
      },
      async (jw_payload, done) => {
        try {
          return done(null, jw_payload); // Successfully authenticated using JWT.
        } catch (error) {
          return done(error); // Handle errors during JWT authentication.
        }
      }
    )
  );
};