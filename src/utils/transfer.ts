import mongoose, { ClientSession } from "mongoose";
import Account, { IAccount } from "../models/AccountModel";
import Transaction from "../models/TransactionModel";
import CustomError from "./CustomError";
import { publishMessage } from "../kafka";

/**
 * A function to perfom transfer by using db transactions
 * @param {string} email
 * @param {float} amount
 * @param {string} senderId
 * @return {Transaction}
 */
async function transfer(email: string, amount: number, senderId: string) {
	// fetch recipient from db via email
	const recipient = await Account.findOne({ email });

	//throw error if recipient does not exist
	if (!recipient) throw new CustomError("Invalid recipient email sent", "NotFound");

	//check if sender is the same as recipient i.e sender is trying to transfer to himself
	if (senderId === recipient._id)
		throw new CustomError("Invalid transaction requested", "Forbidden");

	// initialize a client session and start a transaction
	const session: ClientSession = await mongoose.startSession();
	session.startTransaction();

	try {
		//get sender's balance and subtract amount from it
		const sender = await Account.findById(senderId);
		let balance = (sender?.balance as number) - amount;

		//update sender's balance in db
		await Account.findByIdAndUpdate(senderId, { balance });

		//get recipient's balance and add amount from it
		let balance2 = Number(recipient?.balance) + amount;

		//update recipient's balance in db
		await Account.findByIdAndUpdate(recipient._id, { balance: balance2 });

		// insert new transaction to transactions collection
		const transaction = await Transaction.create({
			sender: senderId,
			recipient: recipient._id,
			amount,
			timestamp: new Date().toISOString(),
		});

		// Commit the changes
		await session.commitTransaction();

		//fetch inserted transaction
		const result = await Transaction.findById(transaction._id)
			.populate("sender recipient")
			.exec();

		// format transaction result before returning
		const resultCleanedUp = {
			id: result?._id.toString(),
			sender: result?.sender as IAccount,
			recipient: result?.recipient as IAccount,
			amount: result?.amount.toString(),
			timestamp: result?.timestamp,
		};

		//final clean up
		const transactionObj = {
			...resultCleanedUp,
			sender: {
				id: resultCleanedUp.sender._id.toString(),
				name: resultCleanedUp.sender.name,
				email: resultCleanedUp.sender.email,
			},
			recipient: {
				id: resultCleanedUp.recipient._id.toString(),
				name: resultCleanedUp.recipient.name,
				email: resultCleanedUp.recipient.email,
			},
		};

		// //publish kafka topic
		// const topic = "transactions";
		// await publishMessage(topic, transaction._id, transaction);

		console.log("results from transfer is: ", result);
		//return transaction object
		return transactionObj;
	} catch (error: any) {
		// abort the transactions
		await session.abortTransaction();
		console.log("Error trasfering amount: ", error);
		throw error;
	} finally {
		await session.endSession();
	}
}

export default transfer;
