import Account from "../models/AccountModel";
import CustomError from "./CustomError";
import generateAccessToken from "./generateAccessToken";

async function createAccount(name: string, email: string, password: string) {
	try {
		// create account with params
		const account = await Account.create({ name, email, password });

		// generate access token and store userId in it
		const accessToken = await generateAccessToken({ userId: account._id });

		// return newly created account object
		return {
			account: {
				id: account._id,
				name: account.name,
				email: account.email,
			},
			accessToken,
		};
	} catch (error: any) {
		console.log("Error creating account: ", error);
		throw new CustomError("User already exists", "Forbidden");
	}
}

export default createAccount;
