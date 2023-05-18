import {
	createAccountHandler,
	loginHandler,
	transferHandler,
	tokenFuncs,
	getAccountHandler,
	getBalanceHandler,
	getTransactionsHandler,
} from "./utils";
import { Context, AccountInput, LoginInput, TransferInput } from "./typings";
import {
	validateCreateAccountInput,
	validateLoginInput,
	validateTransferInput,
} from "./validators";

const resolvers = {
	Query: {
		//resolver to get account
		account: async (_: any, __: any, { req }: Context) => {
			//get token from header and verify it
			const token = tokenFuncs.getTokenFromRequest(req);
			const userId = (await tokenFuncs.verifyToken(token)) as string;

			//get account with userId
			return await getAccountHandler(userId, token);
		},

		//resolver to get balance
		balance: async (_: any, __: any, { req }: Context) => {
			//get token from header and verify it
			const token = tokenFuncs.getTokenFromRequest(req);
			const userId = (await tokenFuncs.verifyToken(token)) as string;

			//get balance with userId
			return await getBalanceHandler(userId);
		},

		//resolver to get transactions
		transactions: async (_: any, __: any, { req }: Context) => {
			//get token from header and verify it
			const token = tokenFuncs.getTokenFromRequest(req);
			const userId = (await tokenFuncs.verifyToken(token)) as string;

			//get transactions related to userId
			return await getTransactionsHandler(userId);
		},
	},

	Mutation: {
		//resolver to create account
		createAccount: async (_: any, { name, email, password }: AccountInput) => {
			await validateCreateAccountInput(name, email, password);
			return await createAccountHandler(name, email, password);
		},

		// resolver to handle login
		login: async (_: any, { email, password }: LoginInput, { res }: Context) => {
			await validateLoginInput(email, password);
			return await loginHandler(email, password, res);
		},

		//resolver to handle transfer
		transfer: async (_: any, { email, amount }: TransferInput, { req }: Context) => {
			// validate inputs
			await validateTransferInput(email, amount);

			//get token from header and verify it
			const token = tokenFuncs.getTokenFromRequest(req);
			const userId = (await tokenFuncs.verifyToken(token)) as string;

			return await transferHandler(email, amount, userId);
		},
	},
};

export default resolvers;
