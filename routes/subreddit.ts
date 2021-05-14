import express from "express";
import { db } from "../tools/db";
const router = express.Router();

router.post("/", async (req, res, next) => {
	const subredditName: string = req.body.name.toLowerCase();
	if (!subredditName) {
		res.status(400).json("You must enter a subreddit name");
		return;
	} else if (subredditName.includes(" ")) {
		res.status(400).json("Subreddit name cannot contain spaces");
		return;
	}
	const statement = `SELECT name FROM subreddits WHERE name = ?`;
	db.get(statement, [subredditName], (err, row) => {
		if (err) {
			res.status(500).json("Server error");
			console.log(err);
		} else if (row) {
			res.status(409).json(
				"There already is a subreddit with that name."
			);
		} else {
			db.get(
				"SELECT id FROM users WHERE username = ?",
				[req.user],
				(error, result) => {
					if (error) {
						res.status(500).json("Server error");
						console.log(error);
					}
					db.run(
						"INSERT INTO subreddits (name, moderator, numFollowers) VALUES (?, ?, ?)",
						[subredditName, result.user, 0],
						(e: any) => {
							if (e) {
								res.status(500).json("Server error");
								console.log(e);
							}
						}
					);
					res.status(200).send("Success");
				}
			);
		}
	});
});
router.get("/:subreddit", (req, res, next) => {
	db.get(
		"SELECT * FROM subreddits WHERE name = ?",
		[req.params.subreddit.toLowerCase()],
		(err, row) => {
			if (err) {
				res.status(500).json("Server error");
				console.log(err);
			} else if (!row) {
				res.status(404).json("There is no subreddit with that name.");
			} else {
				db.all(
					"SELECT * FROM posts JOIN subreddits ON posts.subreddit = subreddits.id WHERE subreddits.name = ?",
					[req.params.subreddit.toLowerCase()],
					(e, rows) => {
						if (e) {
							res.status(500).json("Server error");
							console.log(e);
						}
						res.json(rows);
					}
				);
			}
		}
	);
});
router.get("/", (req, res, next) => {
	db.all(
		"SELECT name, moderator, numFollowers FROM subreddits",
		[],
		(err, rows) => {
			if (err) {
				res.status(500).json("Server error");
				console.log(err);
			} else {
				res.json(rows);
			}
		}
	);
});

export default router;
