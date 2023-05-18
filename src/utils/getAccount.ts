import Account from "../models/AccountModel";
import CustomError from "./CustomError";
import { AccountResObj } from "../typings";

/**
 * A function to get account by id
 * @param {string} id
 * @param {string} accessToken
 * @return {Promise<AccountResObj>}
 */
async function getAccount(id: string, accessToken: string): Promise<AccountResObj> {
	try {
		// get account by id
		const account = await Account.findById(id);

		if (!account) throw new CustomError("Account doesn't exists", "NotFound");

		// return account object
		return {
			id: account._id,
			name: account.name,
			email: account.email,
			accessToken,
		};
	} catch (error: any) {
		console.log("Error getting account: ", error);
		throw error;
	}
}

export default getAccount;
