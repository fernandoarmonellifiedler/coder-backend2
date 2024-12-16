import { request, response } from "express"; // Import request and response objects from Express.

export const authorization = (role) => {
  // Middleware factory function to authorize users based on their role.
  
  return async (req = request, res = response, next) => {
    // Checks if the user session exists.
    if (!req.user) {
      // If no user session is found, respond with a 401 Unauthorized status.
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }
    
    // Verifies if the user's role matches the required role.
    if (req.user.role !== role) {
      // If the roles do not match, respond with a 403 Forbidden status.
      return res.status(403).json({ status: "error", msg: "No permission" });
    }

    // If authorization is successful, proceed to the next middleware or route handler.
    next();
  };
}