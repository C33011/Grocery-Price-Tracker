export type User = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
};

export type Product = {
  productId: number;
  productName: string;
  category: string;
  brand: string | null;
  unitSize: number | null;
  unitType: string | null;
};

export type ShoppingList = {
  listId: number;
  userId: number;
  listName: string;
  createdAt: string | null;
  active: boolean;
};

export type ApiMessage = {
  message: string;
};
