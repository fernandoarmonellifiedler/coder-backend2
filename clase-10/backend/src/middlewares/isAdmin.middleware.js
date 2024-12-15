import { request, response } from "express";

export const isAdmin = async (req = request, res = response, next) => {
  try {
    const user = req.session.user;
    if (!user)
      return res
        .status(401)
        .json({ status: "error", msg: "Usuario no logueado" });
        

    if (user.role !== "admin")
      return res
        .status(403)
        .json({ status: "error", msg: "Usuario no autorizado" });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Erro", msg: "Error interno del servidor" });
  }
};
