import Link from "next/link";
import type { Product } from "@/types/common";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./DashboardPage.module.css";

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section>
      <SectionHeader
        title="Featured products"
        description="Quick access to common grocery staples and their latest tracked details."
      />
      <div className={styles.productGrid}>
        {products.map((product) => (
          <article className={styles.productCard} key={product.productId}>
            <div>
              <p className={styles.meta}>{product.category}</p>
              <h3>{product.productName}</h3>
            </div>
            <dl className={styles.productFacts}>
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
        ))}
      </div>
    </section>
  );
}
