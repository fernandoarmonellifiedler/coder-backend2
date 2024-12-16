import { request, response } from "express"; // Import request and response objects from Express.
import { userDao } from "../dao/mongo/user.dao.js"; // Import the user data access object.

export const checkEmail = async (req = request, res = response, next) => {
  // Middleware to check if the provided email already exists in the database.
  try {
    const { email } = req.body; // Destructure the email from the request body.
    
    // Query the database to see if a user with the provided email already exists.
    const user = await userDao.getByEmail(email);
    
    if (user) {
      // If a user is found, respond with a 400 Bad Request status indicating the email is already in use.
      return res.status(400).json({
        status: "error",
        msg: `El usuario con el email ${email} ya existe`, // Spanish: The user with the email already exists.
      });
    }

    // If no user is found, proceed to the next middleware or route handler.
    next();
  } catch (error) {
    // Log the error for debugging purposes.
    console.log(error);
    
    // Respond with a 500 Internal Server Error status for any unexpected errors.
    res.status(500).json({ status: "error", msg: "Error interno del servidor" }); // Spanish: Internal server error.
  }
};