import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { Context } from "./typings";

config();

const PORT = process.env.PORT || 4000;
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";

const dbUrl = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.z6zfix6.mongodb.net/payments?retryWrites=true&w=majority`;

// Handle errors and return them to the client
const formatError = (error: ApolloError): ApolloError => {
	const code = error.extensions?.code || "InternalServerError";
	const message = error.message || "Internal server error";

	// assign status code based on the error code
	let statusCode: number;
	switch (code) {
		case "ValidationError":
			statusCode = 400;
			break;
		case "Unauthorized":
			statusCode = 401;
			break;
		case "Forbidden":
			statusCode = 403;
			break;
		case "NotFound":
			statusCode = 404;
			break;
		default:
			statusCode = 500;
	}

	error.extensions = {
		code,
		statusCode,
		invalidArgs: error.extensions.invalidArgs,
	};

	return new ApolloError(message, code, {
		...error.extensions,
		//exception: error.extensions.exception,
	});
};

// setup apollo server
const startServer = async () => {
	const app = express();

	//cors
	app.use(cors({ origin: "*" }));

	//parse incoming requests
	app.use(express.urlencoded({ extended: true, limit: "8mb" }));
	app.use(express.json());

	// setup apollo server
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }: Context) => ({ req, res }),
		formatError,
	});

	await server.start();
	server.applyMiddleware({ app });

	app.listen({ port: PORT }, () =>
		console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	);
};

// connect to mongodb and start apollo server
mongoose
	.connect(dbUrl)
	.then(() => {
		console.log("MongoDB connected");
	})
	.then(() => startServer())
	.catch((err) => console.log(err));
