import { Request, Response } from "express";

export interface Context {
	req: Request;
	res: Response;
}

export interface AccountResObj {
	id: string;
	name: string;
	email: string;
	accessToken: string;
}

export type AccountInput = {
	name: string;
	email: string;
	password: string;
};

export type LoginInput = {
	email: string;
	password: string;
};

export type TransferInput = {
	email: string;
	amount: number;
};
