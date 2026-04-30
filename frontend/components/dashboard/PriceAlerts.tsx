import Link from "next/link";
import type { PriceAlert } from "@/types/dashboard";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./DashboardPage.module.css";

type PriceAlertsProps = {
  alerts: PriceAlert[];
};

export default function PriceAlerts({ alerts }: PriceAlertsProps) {
  return (
    <section>
      <SectionHeader
        title="Price alerts"
        description="Products currently priced below their 12-month average."
      />
      <div className={styles.alertGrid}>
        {alerts.map((alert) => (
          <article className={styles.alertCard} key={`${alert.productId}-${alert.storeName}`}>
            <div className={styles.alertTopline}>
              <p className={styles.meta}>{alert.chain}</p>
              <strong>{alert.pctBelowAvg}% off</strong>
            </div>
            <h3>{alert.productName}</h3>
            <p className={styles.store}>{alert.storeName}</p>
            <dl className={styles.pricePair}>
              <div>
                <dt>Current</dt>
                <dd>${alert.currentPrice}</dd>
              </div>
              <div>
                <dt>Average</dt>
                <dd>${alert.avgPrice}</dd>
              </div>
            </dl>
            <Link className="button-link secondary" href={`/products/${alert.productId}`}>
              View product
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
