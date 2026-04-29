import type { Product, ShoppingList, User } from "./common";

export type ProductFilters = {
  search: string;
  category: string;
  chain: string;
};

export type ProductsData = ProductFilters & {
  loggedInUser: User;
  products: Product[];
  userLists: ShoppingList[];
};

export type AddToListRequest = {
  listId: number;
  productIds: number[];
};
