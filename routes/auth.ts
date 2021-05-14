import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import { db } from "../tools/db";

declare module "express-serve-static-core" {
	interface Request {
		user: string;
	}
}

const generateAccessToken = (username: string) => {
	return jwt.sign({ username }, process.env.TOKEN_SECRET);
};
router.post("/login", async (req, res, next) => {
	db.get(
		"SELECT password FROM users WHERE username = ?",
		[req.body.username],
		async (err, row) => {
			console.log(this);
			if (err) {
				console.log(err);
				res.status(500).send("Server error");
			} else if (!row) {
				res.status(401).send("Invalid username or password");
			} else {
				const isAuthorized = await bcrypt.compare(
					req.body.password,
					row.password
				);
				if (isAuthorized) {
					const token = generateAccessToken(req.body.username);
					res.json(token);
				} else {
					res.status(401);
				}
			}
		}
	);
});
router.post("/signup", async (req, res, next) => {
	const password = await bcrypt.hash(req.body.password, 10);
	const username: string = req.body.username;
	const name: string = req.body.name;
	const query = `SELECT name FROM users WHERE username = ?`;
	db.get(query, [username], (err, row) => {
		if (err) {
			console.log(err);
		}
		if (row) {
			res.status(409).json("Username already taken.");
		} else {
			db.run(
				"INSERT into users(username, name, password) VALUES (?, ?, ?)",
				[username, name, password],
				(e) => {
					if (e) {
						console.log(e);
						res.status(500).send("Server error");
					}
				}
			);
			const token = generateAccessToken(username);
			res.json(token);
		}
	});
});

export const authenticateToken = (req: any, res: any, next: any) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
		if (err) return res.sendStatus(403);

		req.user = user.username;

		next();
	});
};

export default router;
