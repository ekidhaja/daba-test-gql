import Account from "../models/AccountModel";
import CustomError from "./CustomError";

/**
 * A function to get account balance by id
 * @param {string} id
 * @return {Promise<string>} balance
 */
async function getBalance(id: string): Promise<string> {
	try {
		// get account by id
		const account = await Account.findById(id);

		if (!account) throw new CustomError("Account doesn't exists", "NotFound");

		// return account object
		return parseFloat(account.balance.toString()).toFixed(2);
	} catch (error: any) {
		console.log("Error getting balance: ", error);
		throw error;
	}
}

export default getBalance;
