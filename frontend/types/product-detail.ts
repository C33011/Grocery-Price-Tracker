import type { Product, User } from "./common";

export type PriceRecord = {
  recordId: number;
  productId: number;
  storeId: number;
  storeName: string;
  chain: string;
  price: number;
  regPrice: number | null;
  sale: boolean;
  priceDate: string;
};

export type MonthlyPoint = {
  month: string; 
  avgPrice: number; 
}; 

export type ProductDetailData = {
  loggedInUser: User;
  product: Product;
  prices: PriceRecord[];
  weekHigh: number | null; 
  weeklow: number | null; 
  predictedPrice: number | null; 
  monthlyHistory: MonthlyPoint[];
};
