import { request, response } from "express"; // Import request and response objects from Express.
import passport from "passport"; // Import Passport for authentication.

export const passportCall = (strategy) => {
  // Middleware to handle authentication using the specified Passport strategy.
  return async (req = request, res = response, next) => {
    // Invoke Passport's authenticate function with the provided strategy.
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        // If an error occurs during authentication, pass it to the next middleware.
        return next(err);
      }
      if (!user) {
        // If no user is found, respond with a 401 Unauthorized status and the error message.
        return res.status(401).json({ 
          status: "error", 
          msg: info.message // Provide the error message from Passport.js.
        });
      }

      // If authentication is successful, attach the user object to the request object.
      req.user = user;

      // Proceed to the next middleware or route handler.
      next();
    })(req, res, next); // Execute the authenticate function with the current request and response.
  };
};