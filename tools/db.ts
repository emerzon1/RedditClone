import User from "../models/User";
import Subreddit from "../models/Subreddit";

export const users: { [username: string]: User } = {};
export const subreddits: { [id: string]: Subreddit } = {};

import sqlite3 from "sqlite3";
sqlite3.verbose();
export const db = new sqlite3.Database("./main.db", sqlite3.OPEN_READWRITE);
