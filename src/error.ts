import {Request, Response} from "express";
import {validationResult} from "express-validator";

export class ErrorHandler extends Error {
	statusCode = 0;
	constructor(statusCode: number, message: string) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

export const handleError = (err: ErrorHandler, req: Request, resp: Response): void => {
	const {statusCode, message} = err;
	const errors = validationResult(req);
	resp.status(statusCode).json({
		status: err.name,
		statusCode,
		message,
		errors: !errors.isEmpty() ? errors.array() : null,
	});
};
