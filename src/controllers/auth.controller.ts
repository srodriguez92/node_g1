import {Request, Response, Router} from "express";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import {ErrorHandler, handleError} from "../error";
import User from "../models/user";

import body_auth_validations from "../middlewares/validators/auth/auth.validator";
import validator_handler from "../middlewares/validator";

const router = Router();
router.post("/", body_auth_validations, validator_handler, async (req: Request, resp: Response) => {
	const {email, password} = req.body;
	try {
		let user = await User.findOne({email});
		if (user) {
			const isMatch = await bycript.compare(password, user.password);
			if (!isMatch) {
				const custom = new ErrorHandler(400, "Invalid Credentials");
				handleError(custom, req, resp);
			}
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(payload, config.get("jwt_secret"), {expiresIn: 3600}, (err, token) => {
				if (err) throw err;
				resp.status(200).json({token});
			});
		} else {
			const custom = new ErrorHandler(400, "Invalid User");
			handleError(custom, req, resp);
		}
	} catch (err) {
		const custom = new ErrorHandler(500, "Server Error");
		handleError(custom, req, resp);
	}
});

export default router;
