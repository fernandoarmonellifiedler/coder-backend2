import jwt from "jsonwebtoken"; // Import the jsonwebtoken library for token handling.
import envsConfig from "../config/envs.config.js"; // Import the environment configuration.

 // Function to generate a JWT token for a user
export const createToken = (user) => {
  const { id, email, role } = user; // Destructure user properties.
  
  // Sign the token with user information and a secret key, setting an expiration time of 5 minutes.
  const token = jwt.sign({ id, email, role }, envsConfig.JWT_KEY, { expiresIn: "5m" });
  
  return token; // Return the generated token.
};

// Function to verify a JWT token and decode its content
export const verifyToken = (token) => {
  try {
    // Verify the token using the secret key and decode its content.
    const decode = jwt.verify(token, envsConfig.JWT_KEY);
    return decode; // Return the decoded information if verification is successful.
  } catch (error) {
    return null; // Return null if verification fails due to an error.
  }
};