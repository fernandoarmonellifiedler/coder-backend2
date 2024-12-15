import jwt from "jsonwebtoken";
import envsConfig from "../config/envs.config.js";

// Función que crea el token
export const createToken = (user) => {
  const { id, email, role } = user;
  const token = jwt.sign({ id, email, role }, envsConfig.JWT_KEY, { expiresIn: "5m" });
  return token;
};

// Función que verifica el token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, envsConfig.JWT_KEY);
    return decode;
  } catch (error) {
    return null;
  }
};
