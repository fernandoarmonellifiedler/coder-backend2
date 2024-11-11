import jwt from "jsonwebtoken";

// Función que crea el token
export const createToken = (user) => {
  const { id, email } = user;
  const token = jwt.sign({ id, email }, "ClaveSecreta", { expiresIn: "1m" });
  return token;
};

// Función que verifica el token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, "ClaveSecreta");
    return decode;
  } catch (error) {
    return null;
  }
};
