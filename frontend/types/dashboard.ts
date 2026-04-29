import type { Product, User } from "./common";

export type PriceAlert = {
  productId: number;
  productName: string;
  brand: string | null;
  category: string;
  storeName: string;
  chain: string;
  currentPrice: number;
  avgPrice: number;
  pctBelowAvg: number;
};

export type DashboardData = {
  loggedInUser: User;
  featuredProducts: Product[];
  priceAlerts: PriceAlert[];
};
