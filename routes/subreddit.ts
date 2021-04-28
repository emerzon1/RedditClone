import express from "express";
import { currentUser, subreddits } from "../tools/db";
import Subreddit from "../models/Subreddit";
const router = express.Router();

router.post("/", (req, res, next) => {
	const subredditName: string = req.body.name;
	if (!subredditName) {
		res.status(400).json("You must enter a subreddit name");
		return;
	}
	if (subreddits[subredditName]) {
		res.status(409).json("There already is a subreddit with that name.");
		return;
	}
	const newSubreddit: Subreddit = {
		name: subredditName,
		moderator: currentUser[0].username, // setting user who made the subreddit as the moderator
		posts: {},
		numFollowers: 0,
	};
	subreddits[subredditName] = newSubreddit;
	res.json(newSubreddit);
});
router.get("/:subreddit", (req, res, next) => {
	if (!subreddits[req.params.subreddit]) {
		res.status(404).json("No subreddit with that name");
	} else {
		res.json(subreddits[req.params.subreddit]);
	}
});
router.get("/", (req, res, next) => {
	res.json(subreddits);
});
export default router;
