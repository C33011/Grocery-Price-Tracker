import type { Product, ShoppingList, User } from "./common";

export type ListItem = {
  itemId: number;
  listId: number;
  productId: number;
  productName: string;
  quantity: number;
  checked: boolean;
};

export type ListDetailData = {
  loggedInUser: User;
  list: ShoppingList;
  items: ListItem[];
  allProducts: Product[];
  listId: number;
};

export type AddItemRequest = {
  productId: number;
  quantity: number;
};

export type CheckedRequest = {
  checked: boolean;
};
