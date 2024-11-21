import { request, response } from "express";

export const authorization = (role) => {
  return (req = request, res = response, next) => {
    // Verifica si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    // Verifica si el rol del usuario coincide con el rol requerido
    if (req.user.role !== role) {
      return res.status(403).json({
        status: "error",
        message: "Access denied"
      });
    }

    // Continua al siguiente middleware
    return next();
  };
};
