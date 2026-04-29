import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/common";
import type { AddToListRequest, ProductFilters, ProductsData } from "@/types/products";

export function getProducts(filters: ProductFilters): Promise<ProductsData> {
  const params = new URLSearchParams();
  params.set("search", filters.search);
  params.set("category", filters.category);
  params.set("chain", filters.chain);

  return apiRequest<ProductsData>(`/api/products?${params.toString()}`);
}

export function addProductsToList(payload: AddToListRequest): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/api/products/add-to-list", {
    method: "POST",
    body: payload,
  });
}
