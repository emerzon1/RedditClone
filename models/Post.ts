export default interface Post {
	id: string;
	author: string;
	title: string;
	content: string;
	comments: string[];
	timestamp: Date;
	numUpvotes: number;
}
