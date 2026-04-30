import type { PriceRecord } from "@/types/product-detail";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ProductDetailPage.module.css";

type PriceHistoryListProps = {
  prices: PriceRecord[];
};

export default function PriceHistoryList({ prices }: PriceHistoryListProps) {
  return (
    <section>
      <SectionHeader
        title="Price history"
        description={`${prices.length} tracked price records for this product.`}
      />
      <div className={styles.priceList}>
        {prices.map((price) => (
          <article className={styles.priceCard} key={price.recordId}>
            <div>
              <p className={styles.chain}>{price.chain}</p>
              <h3>{price.storeName}</h3>
              <p className={styles.date}>{price.priceDate}</p>
            </div>
            <dl className={styles.priceFacts}>
              <div>
                <dt>Price</dt>
                <dd>${price.price}</dd>
              </div>
              <div>
                <dt>Regular</dt>
                <dd>{price.regPrice ? `$${price.regPrice}` : "Not listed"}</dd>
              </div>
              <div>
                <dt>Sale</dt>
                <dd>{price.sale ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
