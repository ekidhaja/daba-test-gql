import JWT from "jsonwebtoken";
import { config } from "dotenv";

config();

// Get secret key for JWT signing from env
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "";

/* A function to generate access token.
 ** It generates and returns an access token and throws an error if something goes wrong
 */
async function generateAccessToken(payload: any) {
	return new Promise(async (resolve, reject) => {
		//prepare and sign access token
		const options = { expiresIn: "1h", issuer: "https://dabafinance.com" };
		JWT.sign(payload, JWT_SECRET, options, (err, token) => {
			if (err) {
				reject(err);
				return;
			}

			resolve(token);
		});
	});
}

export default generateAccessToken;
