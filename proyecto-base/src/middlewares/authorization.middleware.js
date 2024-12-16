import { request, response } from "express"

export const authorization = (role) => {
  return async (req = request, res = response, next) => {
    // Validamos que haya una session de usuario
    if(!req.user) return res.status(401).json({status: "error", msg: "Unauthorized"});
    // Verifica si el rol del usuario coincide con el rol requerido
    if(req.user.role !== role) return res.status(403).json({status: "error", msg: "No permission"})

    // Continua al siguiente middleware
    next();
  }
}