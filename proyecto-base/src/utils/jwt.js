import jwt from "jsonwebtoken";
import envsConfig from "../config/envs.config.js";

// Función para generar un token
export const createToken = (user) => {
  const { id, email, role } = user;
  const token = jwt.sign({ id, email, role }, envsConfig.JWT_KEY, { expiresIn: "5m" });
  return token;
};

// Función para verificar un token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, envsConfig.JWT_KEY);
    return decode;
  } catch (error) {
    return null;
  }
};
