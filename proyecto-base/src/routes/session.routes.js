import { Router } from "express"; // Import the Router from Express.
import { userDao } from "../dao/mongo/user.dao.js"; // Import the user data access object.
import passport from "passport"; // Import Passport for authentication.
import { passportCall } from "../middlewares/passport.middleware.js"; // Import the Passport middleware.
import { authorization } from "../middlewares/authorization.middleware.js"; // Import the authorization middleware.
import { SessionController } from "../controllers/session.controller.js"; // Import the SessionController.

const sessionController = new SessionController(); // Instantiate the SessionController.
const router = Router(); // Initialize a new router.

// Route to register a new user
router.post("/register", passportCall("register"), sessionController.register); // Handle user registration with Passport.

// Route to log in
router.post("/login", passportCall("login"), sessionController.login); // Handle user login with Passport.

// Route to log out
router.get("/logout", sessionController.logout); // Handle user logout.

// Route to get the current user
router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id); // Get user by ID
    res.status(200).json({ status: "success", payload: user }); // Respond with user details.
  } catch (error) {
    console.log(error); // Log any errors.
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" }); // Respond with an internal server error message.
  }
});

// Route for Google authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"], // Specify the scopes needed for Google authentication.
    session: false, // Disable session support.
  }),
  (req, res) => {
    res.status(200).json({ status: "success", payload: req.user }); // Respond with the authenticated user details.
  }
);

export default router; // Export the router for use in the application.