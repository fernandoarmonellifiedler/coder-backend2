import { request, response } from "express";
import passport from "passport";

export const passportCall = (strategy) => {
  return async (req = request, res = response, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ status: "error", message: info.message })

      req.user = user;
      next();
    })(req, res, next);
  }
}