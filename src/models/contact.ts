import {Schema, model, Document} from "mongoose";
const ContactSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
	},
	type: {
		type: String,
		default: "personal",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

interface IContactSchema extends Document {
	user: Schema.Types.ObjectId;
	name: string;
	email: string;
	phone: string;
	type: string;
	date: string;
}

export default model<IContactSchema>("Contact", ContactSchema);
