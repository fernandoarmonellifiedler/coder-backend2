import { createToken } from "../utils/jwt.js"; // Import the function to create JWT tokens.

export class SessionController {
  // Defines the SessionController class to manage user session-related actions.

  async register(req, res) {
    // Handles user registration.
    try {
      // Logic for registering a user would typically occur here.
      res.status(201).json({ status: "success", msg: "Usuario Registrado" }); // Respond with success message and status 201.
    } catch (error) {
      this.handleError(res, error); // Handle any errors during registration.
    }
  }

  async login(req, res) {
    // Handles user login.
    try {
      // Generate a JWT token for the authenticated user.
      const token = createToken(req.user); // Calls the function to create a token using the user information.

      // Store the token in an HTTP-only cookie for security.
      res.cookie("token", token, { httpOnly: true }); // Sets the cookie with the token.

      res.status(200).json({ status: "success", payload: req.user }); // Respond with user information and status 200.
    } catch (error) {
      this.handleError(res, error); // Handle any errors during login.
    }
  }

  async logout(req, res) {
    // Handles user logout.
    try {
      req.session.destroy(); // Destroys the session, logging the user out.
      res.status(200).json({ status: "success", msg: "Session cerrada" }); // Respond with success message indicating that the session is closed.
    } catch (error) {
      this.handleError(res, error); // Handle any errors during logout.
    }
  }

  handleError(res, error) {
    // Custom error handler to streamline error responses.
    console.error(error); // Logs the error to the console for debugging.
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" }); // Respond with a generic server error message.
  }
}