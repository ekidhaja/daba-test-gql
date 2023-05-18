import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// define account attributes and inherit _id from mongodb
export interface IAccount extends Document {
	name: string;
	email: string;
	password: string;
	balance: number;
}

interface AccountModel extends Model<IAccount> {
	login: any;
}

// declare schema for account
const AccountSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		balance: { type: Schema.Types.Decimal128, default: 1000.0 },
	},
	{ versionKey: false, timestamps: true }
);

// A pre save hook to hash password before inserting to db
AccountSchema.pre("save", async function (next) {
	try {
		let salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err: any) {
		next(err);
	}
});

// create login statics function to perform loging
AccountSchema.statics.login = async function (email, password) {
	// fetch user from db
	const user = await this.findOne({ email });

	if (user) {
		//check if passwords match and return user if it does
		let isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (isPasswordCorrect) return user;

		return null;
	}

	return null;
};

export default mongoose.model<IAccount, AccountModel>("account", AccountSchema);
