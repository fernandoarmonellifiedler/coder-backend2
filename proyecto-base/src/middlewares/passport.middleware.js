import { request, response } from "express";
import passport from "passport";

export const passportCall = (strategy) => {
	return (req = request, res = response, next) => {
		passport.authenticate(strategy, (error, user, info) => {
			if (error) {
				return next(error);
			}
			if (!user) {
				return res.status(401).json({ 
					status: "error", 
					message: info?.message || "Unauthorized" 
				});
			}
			req.user = user;
			return next();
		})(req, res, next);
	};
};
