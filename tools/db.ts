import User from "../models/User";
import Subreddit from "../models/Subreddit";

export const users: { [username: string]: User } = {};
export const subreddits: { [id: string]: Subreddit } = {};
export let currentUser: any[] = [""];
