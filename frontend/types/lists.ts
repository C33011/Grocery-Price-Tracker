import type { ShoppingList, User } from "./common";

export type ListsData = {
  loggedInUser: User;
  lists: ShoppingList[];
};

export type CreateListRequest = {
  listName: string;
};
