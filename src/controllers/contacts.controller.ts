import {Request, Response, Router} from "express";
import auth_token from "../middlewares/auth/auth.midd";
import {ErrorHandler, handleError} from "../error";
import Contact from "../models/contact";
import post_contact_validations from "../middlewares/validators/contact/post";
import put_contact_validations from "../middlewares/validators/contact/put";
import validator_handler from "../middlewares/validator";
const router = Router();

router.get("/", auth_token, async (req: Request, res: Response) => {
	try {
		const contacts = await Contact.find({user: req.user?.id}).sort({date: -1});
		return res.status(200).json({
			data: contacts,
			msj: "List of contacts",
		});
	} catch (err) {
		const custom = new ErrorHandler(500, "Server Error");
		handleError(custom, req, res);
	}
});

router.post(
	"/",
	auth_token,
	post_contact_validations,
	validator_handler,
	async (req: Request, res: Response) => {
		const {name, email, phone, type, date} = req.body;
		try {
			let newContact = new Contact({
				user: req.user?.id,
				name,
				email,
				phone,
				type,
				date,
			});
			const contact = await newContact.save();

			res.status(201).json({
				data: contact,
				msj: "Contact Created",
			});
		} catch (err) {
			const custom = new ErrorHandler(500, "Server Error");
			handleError(custom, req, res);
		}
	}
);

router.put(
	"/",
	auth_token,
	put_contact_validations,
	validator_handler,
	async (req: Request, res: Response) => {
		try {
			const {name, email, phone, type, date} = req.body;
			const contactFields: any = {};

			if (name) contactFields.name = name;
			if (email) contactFields.email = email;
			if (phone) contactFields.phone = phone;
			if (type) contactFields.type = type;
			if (date) contactFields.date = date;

			let contact = await Contact.findById(req.query.id);
			if (!contact) {
				const custom = new ErrorHandler(404, "Contact not Found");
				handleError(custom, req, res);
				return;
			}

			if (contact?.user.toString() !== req.user?.id) {
				const custom = new ErrorHandler(401, "Not Authorized");
				handleError(custom, req, res);
				return;
			}

			contact = await Contact.findByIdAndUpdate(req.query.id, {$set: contactFields}, {new: true});

			return res.status(200).json({
				data: contact,
				msj: "Contact updated",
			});
		} catch (err) {
			const custom = new ErrorHandler(500, "Server Error");
			handleError(custom, req, res);
		}
	}
);

router.delete("/:id", auth_token, async (req: Request, res: Response) => {
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			const custom = new ErrorHandler(404, "Contact not Found");
			handleError(custom, req, res);
			return;
		}

		if (contact?.user.toString() !== req.user?.id) {
			const custom = new ErrorHandler(401, "Not Authorized");
			handleError(custom, req, res);
			return;
		}

		await Contact.findByIdAndRemove(req.params.id);
		return res.status(200).json({
			data: contact,
			msj: "Contact Removed",
		});
	} catch (err) {
		const custom = new ErrorHandler(500, "Server Error");
		handleError(custom, req, res);
	}
});

export default router;
