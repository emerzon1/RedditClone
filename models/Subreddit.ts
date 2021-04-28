import Post from "./Post";
export default interface Subreddit {
	moderator: string;
	name: string;
	posts: Post[];
	numFollowers: number;
}
