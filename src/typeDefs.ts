import { gql } from "apollo-server-express";

const typeDefs = gql`
	type Query {
		account: Account
		balance: Float!
		transactions: [Transaction]
	}

	type Mutation {
		createAccount(name: String!, email: String!, password: String!): AccountAuth
		login(email: String!, password: String!): AccountAuth
		transfer(email: String!, amount: Float!): Transaction
	}

	type Account {
		id: ID!
		name: String!
		email: String!
	}

	type AccountAuth {
		account: Account!
		accessToken: String!
	}

	type Transaction {
		id: ID!
		sender: Account!
		recipient: Account!
		amount: Float!
		timestamp: String!
	}
`;

export default typeDefs;
