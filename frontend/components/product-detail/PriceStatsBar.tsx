import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ProductDetailPage.module.css";

type PriceStatsBarProps = {
  weekHigh: number | null;
  weekLow: number | null;
  predictedPrice: number | null;
};

function fmt(value: number | null): string {
  return value != null ? `$${Number(value).toFixed(2)}` : "—";
}

export default function PriceStatsBar({ weekHigh, weekLow, predictedPrice }: PriceStatsBarProps) {
  return (
    <section>
      <SectionHeader
        title="52-week range & forecast"
        description="Price extremes over the past year and a linear regression forecast for next month."
      />
      <dl className={styles.statsBar}>
        <div>
          <dt>52-week low</dt>
          <dd>{fmt(weekLow)}</dd>
        </div>
        <div>
          <dt>52-week high</dt>
          <dd>{fmt(weekHigh)}</dd>
        </div>
        <div>
          <dt>Predicted next month</dt>
          <dd>{fmt(predictedPrice)}</dd>
        </div>
      </dl>
    </section>
  );
}
