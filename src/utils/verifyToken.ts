import { Request } from "express";
import CustomError from "./CustomError";
import { config } from "dotenv";
import JWT from "jsonwebtoken";

// load env variables
config();

// get access token secret from env
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

/**
 * A function to extract token from authorization bearer header
 * @param {Request} req
 * @return {string}
 */
const getTokenFromRequest = (req: Request): string => {
	//get authorization header
	const header = req.headers.authorization;

	//check if request header contains a bearer token and retieve it
	if (header && header.startsWith("Bearer ")) {
		return header.split(" ")[1];
	}

	//throw error if no token was sent
	throw new CustomError("Token not sent", "ValidationError");
};

/**
 * A function to verify token with jwt and secret
 * @param {string} token
 * @return {Promise}
 */
const verifyToken = (token: string) => {
	return new Promise(async (resolve, reject) => {
		JWT.verify(token, JWT_SECRET, (err, payload) => {
			//throw error if error
			if (err) {
				const error = new CustomError("Invalid token", "Unauthorized");
				reject(error);
				return;
			}

			//return payload
			const { userId } = payload as { userId: string };
			resolve(userId);
		});
	});
};

const token = {
	verifyToken,
	getTokenFromRequest,
};

export default token;
