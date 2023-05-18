import mongoose, { Document, Schema } from "mongoose";
import { IAccount } from "./AccountModel";

// define account attributes and inherit _id from mongodb
interface ITransaction extends Document {
	sender: mongoose.Types.ObjectId | IAccount;
	recipient: mongoose.Types.ObjectId | IAccount;
	amount: number;
	timestamp: string;
}

// declare schema for account
const TransactionSchema: Schema = new Schema(
	{
		sender: { type: Schema.Types.ObjectId, ref: "account", required: true },
		recipient: { type: Schema.Types.ObjectId, ref: "account", required: true },
		amount: { type: Schema.Types.Decimal128, required: true },
		timestamp: { type: String, required: true },
	},
	{ versionKey: false, timestamps: false }
);

export default mongoose.model<ITransaction>("transaction", TransactionSchema);
