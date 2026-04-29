import { apiRequest } from "@/lib/api";
import type { ProductDetailData } from "@/types/product-detail";

export function getProductDetail(productId: number): Promise<ProductDetailData> {
  return apiRequest<ProductDetailData>(`/api/products/${productId}`);
}
