import jwt from "jsonwebtoken";

// Función para generar un token
export const createToken = (user) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, "ClaveSecreta", { expiresIn: "5m" });
};

// Función para verificar un token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, "ClaveSecreta");
  } catch {
    return null;
  }
};
