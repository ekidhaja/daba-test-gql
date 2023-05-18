import { ApolloError } from "apollo-server-express";

// Define custom error class
class CustomError extends ApolloError {
	constructor(message: string, code: string) {
		super(message, code);
		this.code = code;
	}
}

export default CustomError;
