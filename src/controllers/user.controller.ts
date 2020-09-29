import {Request, Response, Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user";
import {ErrorHandler, handleError} from "../error";

const router = Router();
//============
//POST
//Resgister User
//PUBLIC
//============
router.post("/", async (req: Request, resp: Response) => {
	const {name, email, password} = req.body;
	try {
		let user = await User.findOne({email});
		if (user) {
			const custom = new ErrorHandler(400, "User already exists");
			handleError(custom, req, resp);
		}
		user = new User({
			name,
			email,
			password,
		});
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, config.get("jwt_secret"), {expiresIn: 3600}, (err, token) => {
			if (err) throw err;
			resp.status(200).json({
				data: {token},
				msj: "User Created",
			});
		});
	} catch (err) {
		const custom = new ErrorHandler(500, "Server Error");
		handleError(custom, req, resp);
	}
});

export default router;
