import { request, response } from "express";

export const isAdmin = (req = request, res = response, next) => {
  try {

    if(!req.session.admin || !req.session.user) {
        return res.status(401).send("No tienes permiso para acceder a esta ruta");
    }
    // Si todo está bien continua con la ejecución del endpoint
    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
