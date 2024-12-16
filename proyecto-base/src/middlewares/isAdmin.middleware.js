import { request, response } from "express";

export const isAdmin = async (req = request, res = response, next) => {
  try {
    const user = req.session.user;

    // Verificamos si el usuario está logueado
    if (!user)
      return res
        .status(401)
        .json({ status: "error", msg: "Usuario no logueado" });

    // Verificamos si el usuario tiene rol de administrador
    if (user.role !== "admin")
      return res
        .status(403)
        .json({ status: "error", msg: "Usuario no autorizado" });

    // Si el usuario es admin, continuamos con la solicitud
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};
