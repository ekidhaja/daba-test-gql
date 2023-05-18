import Account from "../models/AccountModel";
import generateAccessToken from "./generateAccessToken";
import CustomError from "./CustomError";
import { Response } from "express";

async function loginHandler(email: string, password: string, res: Response) {
	try {
		// try and login with credentials
		const account = await Account.login(email, password);

		// check if login worked and throw error if not
		if (!account) throw new CustomError("Invalid login credentials", "NotFound");

		// generate access token and store userId in it
		const accessToken = await generateAccessToken({ userId: account._id });

		//return account object
		return {
			account: {
				id: account._id,
				name: account.name,
				email: account.email,
			},
			accessToken,
		};
	} catch (error: any) {
		console.log("Error loggin into account: ", error);
		throw error;
	}
}

export default loginHandler;
