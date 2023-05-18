import Transaction from "../models/TransactionModel";
import CustomError from "./CustomError";
import { IAccount } from "../models/AccountModel";

/**
 * A function to get account balance by id
 * @param {string} id
 * @return {[Transaction]}
 */
async function getTransactions(id: string) {
	try {
		const result = await Transaction.find({
			$or: [{ sender: id }, { recipient: id }],
		})
			.populate("sender recipient")
			.exec();

		// format transaction result to before returning
		const resultCleanedUp = result.map((result) => {
			return {
				id: result._id.toString(),
				sender: result.sender as IAccount,
				recipient: result.recipient as IAccount,
				amount: result.amount.toString(),
				timestamp: result.timestamp,
			};
		});

		const transactions = resultCleanedUp.map((result) => ({
			...result,
			sender: {
				id: result.sender._id.toString(),
				name: result.sender.name,
				email: result.sender.email,
			},
			recipient: {
				id: result.recipient._id.toString(),
				name: result.recipient.name,
				email: result.recipient.email,
			},
		}));

		// return account object
		return transactions;
	} catch (error: any) {
		console.log("Error getting balance: ", error);
		throw error;
	}
}

export default getTransactions;
