import User from "../models/User";
import Subreddit from "../models/Subreddit";
import Post from "../models/Post";

export const users: { [username: string]: User } = {};
export const subreddits: { [id: string]: Subreddit } = {};
export const posts: { [id: string]: Post } = {};
