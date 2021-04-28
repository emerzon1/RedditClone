import express from "express";
import { posts, subreddits } from "../tools/db";
import Post from "../models/Post";

const router = express.Router();

router.post("/:subreddit/", (req, res, next) => {
	const currentTime: Date = new Date(Date.now());
	const uniqueID =
		req.body.title +
		Date.UTC(
			currentTime.getFullYear(),
			currentTime.getMonth(),
			currentTime.getDate(),
			currentTime.getHours(),
			currentTime.getMinutes(),
			currentTime.getSeconds()
		) +
		"" +
		Math.random() * currentTime.getSeconds();
	const newPost: Post = {
		title: req.body.title,
		author: req.user.username,
		content: req.body.content,
		id: uniqueID,
		timestamp: currentTime,
		numUpvotes: 0,
		comments: [],
	};

	posts[uniqueID] = newPost;
	subreddits[req.params.subreddit].posts[uniqueID] = newPost;
	res.json(newPost);
});
router.get("/:subreddit/:post", (req, res, next) => {
	if (!subreddits[req.params.subreddit]) {
		res.status(404).json("No subreddit with that name");
	}
	if (!subreddits[req.params.subreddit].posts[req.params.post]) {
		res.status(404).json("No post with that name");
	} else {
		res.json(subreddits[req.params.subreddit].posts[req.params.post]);
	}
});
router.get("/:subreddit", (req, res, next) => {
	res.json(subreddits[req.params.subreddit].posts);
});

export default router;
