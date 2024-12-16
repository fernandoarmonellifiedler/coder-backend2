import { request, response } from "express"; // Import request and response objects from Express.

export const isAdmin = async (req = request, res = response, next) => {
  // Middleware to check if the user is logged in and has administrator privileges.
  try {
    const user = req.session.user; // Retrieve the user information from the session.

    // Check if the user is logged in.
    if (!user) {
      // If not logged in, respond with a 401 Unauthorized status.
      return res.status(401).json({ 
        status: "error", 
        msg: "User not logged in"
      });
    }

    // Check if the user has admin role.
    if (user.role !== "admin") {
      // If the user is not authorized, respond with a 403 Forbidden status.
      return res.status(403).json({ 
        status: "error", 
        msg: "User not authorized"
      });
    }

    // If the user is logged in and is an admin, proceed to the next middleware or route handler.
    next();
  } catch (error) {
    // Log the error for debugging purposes.
    console.log(error);
    
    // Respond with a 500 Internal Server Error status for unexpected errors.
    res.status(500).json({ 
      status: "error", 
      msg: " Internal server error"
    });
  }
};