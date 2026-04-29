import type { User } from "./common";

export type ForumPost = {
  postId: number;
  userId: number;
  username: string;
  title: string;
  body: string;
  postedAt: string;
};

export type ForumData = {
  loggedInUser: User;
  posts: ForumPost[];
};

export type CreatePostRequest = {
  title: string;
  body: string;
};
