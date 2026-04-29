import ProductDetailPage from "@/components/product-detail/ProductDetailPage";

type ProductDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: ProductDetailRouteProps) {
  const { id } = await params;

  return <ProductDetailPage productId={Number(id)} />;
}
