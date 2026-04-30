import type { Product } from "@/types/common";
import styles from "./ProductDetailPage.module.css";

type ProductSummaryProps = {
  product: Product;
};

export default function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <section className={styles.summary}>
      <dl>
        <div>
          <dt>Category</dt>
          <dd>{product.category}</dd>
        </div>
        <div>
          <dt>Brand</dt>
          <dd>{product.brand || "Store brand"}</dd>
        </div>
        <div>
          <dt>Size</dt>
          <dd>
            {product.unitSize} {product.unitType}
          </dd>
        </div>
      </dl>
    </section>
  );
}
