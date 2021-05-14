import express from "express";
import { db } from "../tools/db";

const router = express.Router();

router.post("/:subreddit/", (req, res, next) => {
	if (!(req.body.title && req.body.content)) {
		res.status(400).json("Missing title or content");
		return;
	}
	db.get(
		"SELECT * FROM subreddits WHERE name = ?",
		[req.params.subreddit.toLowerCase()],
		(err, row) => {
			if (err) {
				console.log(err);
				res.status(500).json("Server error");
			} else if (!row) {
				res.status(404).json("No subreddit with that name");
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
							"INSERT INTO posts (title, content, subreddit, authorID, numUpvotes) VALUES (?, ?, ?, ?, ?)",
							[
								req.body.title,
								req.body.content,
								req.params.subreddit.toLowerCase(),
								result.id,
								0,
							],
							(e) => {
								if (e) {
									console.log(e);
									res.status(500).json("Server error");
								}
							}
						);
					}
				);

				res.status(200).json("Success");
			}
		}
	);
});
const subreddits: any = {};
router.get("/:subreddit/:post", (req, res, next) => {
	db.get(
		"SELECT * FROM subreddits WHERE name = ?",
		[req.params.subreddit.toLowerCase()],
		(err, row) => {
			if (err) {
				console.log(err);
				res.status(500).json("Server error");
			} else if (!row) {
				res.status(404).json("No subreddit with that name");
			} else {
				db.get(
					"SELECT * FROM posts WHERE id = ?",
					[req.params.post],
					(e, r) => {
						if (e) {
							console.log(e);
							res.status(500).json("Server error");
						} else if (!r) {
							res.status(404).json("No post with that id");
						} else {
							res.json(r);
						}
					}
				);
			}
		}
	);
});

export default router;
