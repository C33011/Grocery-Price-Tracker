import Link from "next/link";
import type { Product } from "@/types/common";
import styles from "./ProductsPage.module.css";

type ProductCardProps = {
  product: Product;
  selected: boolean;
  onToggle: (productId: number) => void;
};

export default function ProductCard({ product, selected, onToggle }: ProductCardProps) {
  return (
    <article className={`${styles.productCard} ${selected ? styles.selectedCard : ""}`}>
      <label className={styles.selectControl}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(product.productId)}
        />
        <span>{selected ? "Selected" : "Select"}</span>
      </label>
      <div className={styles.productCopy}>
        <p>{product.category}</p>
        <h3>{product.productName}</h3>
      </div>
      <dl className={styles.productMeta}>
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
      <Link className="button-link secondary" href={`/products/${product.productId}`}>
        View details
      </Link>
    </article>
  );
}
