import type { Product } from "@/types/common";
import ProductCard from "./ProductCard";
import styles from "./ProductsPage.module.css";

type ProductGridProps = {
  products: Product[];
  selectedProductIds: number[];
  onToggleProduct: (productId: number) => void;
};

export default function ProductGrid({
  products,
  selectedProductIds,
  onToggleProduct,
}: ProductGridProps) {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          selected={selectedProductIds.includes(product.productId)}
          onToggle={onToggleProduct}
        />
      ))}
    </div>
  );
}
