import * as yup from "yup";
import { ApolloError } from "apollo-server-express";

// schema for create account inputs
const accountSchema = yup.object().shape({
	name: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().min(4, "Password must be at least 6 characters").required(),
});

// schema for login inputs
const loginSchema = yup.object().shape({
	email: yup.string().email().required(),
	password: yup.string().required(),
});

// schema for transfer inputs
const transferSchema = yup.object().shape({
	email: yup.string().email().required(),
	amount: yup.number().required(),
});

// function to validate create account inputs
export async function validateCreateAccountInput(name: string, email: string, password: string) {
	try {
		await accountSchema.validate({ name, email, password }, { abortEarly: false });
	} catch (error: any) {
		const validationErrors = error.inner.map((err: yup.ValidationError) => ({
			field: err.path,
			message: err.message,
		}));

		throw new ApolloError("Invalid account data", "ValidationError", {
			invalidArgs: validationErrors,
		});
	}
}

// function to validate login inputs
export async function validateLoginInput(email: string, password: string) {
	try {
		await loginSchema.validate({ email, password }, { abortEarly: false });
	} catch (error: any) {
		const validationErrors = error.inner.map((err: yup.ValidationError) => ({
			field: err.path,
			message: err.message,
		}));

		throw new ApolloError("Invalid account data", "ValidationError", {
			invalidArgs: validationErrors,
		});
	}
}

// function to validate transfer inputs
export async function validateTransferInput(email: string, amount: number) {
	try {
		await transferSchema.validate({ email, amount }, { abortEarly: false });
	} catch (error: any) {
		const validationErrors = error.inner.map((err: yup.ValidationError) => ({
			field: err.path,
			message: err.message,
		}));

		throw new ApolloError("Invalid account data", "ValidationError", {
			invalidArgs: validationErrors,
		});
	}
}
