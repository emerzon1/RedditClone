import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const database: { [username: string]: string } = {};
const generateAccessToken = (username: string) => {
	return jwt.sign(username, process.env.TOKEN_SECRET);
};
router.post("/login", async (req, res, next) => {
	const isAuthorized = await bcrypt.compare(
		req.body.password,
		database[req.body.username]
	);
	if (isAuthorized) {
		const token = generateAccessToken(req.body.username);
		res.json(token);
	} else {
		res.status(401);
	}
});
router.post("/signup", async (req, res, next) => {
	const password = await bcrypt.hash(req.body.password, 10);
	const username: string = req.body.username;
	database[username] = password;
	const token = generateAccessToken(req.body.username);
	res.json(token);
});

export const authenticateToken = (req: any, res: any, next: any) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.TOKEN_SECRET, (err: any, user: any) => {
		console.log(err);

		if (err) return res.sendStatus(403);

		req.user = user;

		next();
	});
};

export default router;
