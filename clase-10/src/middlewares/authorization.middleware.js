import { request, response } from "express"

export const authorization = (role) => {
  return async (req = request, res = response, next) => {
    // Validamos que haya una session de usuario
    if(!req.user) return res.status(401).json({status: "error", msg: "Unauthorized"});
    // Validamos si el rol del usuario logueado es igual al rol autorizado
    if(req.user.role !== role) return res.status(403).json({status: "error", msg: "No permission"})

    next();
  }
}