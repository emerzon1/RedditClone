export default interface Post {
	id: number;
	author: number;
	title: string;
	content: string;
	comments: string[];
	timestamp: Date;
	numUpvotes: number;
}
