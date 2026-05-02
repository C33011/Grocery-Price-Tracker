"use client";

import type { MonthlyPoint } from "@/types/product-detail";
import SectionHeader from "@/components/shared/SectionHeader";
import styles from "./ProductDetailPage.module.css";

type MonthlyHistoryChartProps = {
  history: MonthlyPoint[];
};

const W = 700;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 44, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

export default function MonthlyHistoryChart({ history }: MonthlyHistoryChartProps) {
  if (history.length === 0) {
    return (
      <section>
        <SectionHeader
          title="Monthly price history"
          description="No historical data available for this product yet."
        />
      </section>
    );
  }

  const prices = history.map((p) => Number(p.avgPrice));
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;
  const barW = INNER_W / history.length;

  const scaleY = (price: number) =>
    INNER_H - ((price - minP) / range) * INNER_H;

  return (
    <section>
      <SectionHeader
        title="Monthly price history"
        description={`Average price per month across all stores — last ${history.length} months.`}
      />
      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={styles.chart}
          role="img"
          aria-label="Monthly price history chart"
        >
          <g transform={`translate(${PAD.left}, ${PAD.top})`}>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = INNER_H * (1 - t);
              const price = minP + t * range;
              return (
                <g key={t}>
                  <line
                    x1={0} y1={y} x2={INNER_W} y2={y}
                    stroke="var(--color-faint)" strokeWidth={1} strokeDasharray="4 4"
                  />
                  <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="var(--color-muted)">
                    ${price.toFixed(2)}
                  </text>
                </g>
              );
            })}
            {history.map((point, i) => {
              const barH = INNER_H - scaleY(Number(point.avgPrice));
              const x = i * barW + barW * 0.1;
              const bw = barW * 0.8;
              return (
                <g key={point.month}>
                  <rect
                    x={x}
                    y={scaleY(Number(point.avgPrice))}
                    width={bw}
                    height={Math.max(barH, 2)}
                    fill="var(--color-plum)"
                    opacity={0.75}
                    rx={2}
                  />
                  {i % 3 === 0 && (
                    <text
                      x={x + bw / 2}
                      y={INNER_H + 16}
                      textAnchor="middle"
                      fontSize={9}
                      fill="var(--color-muted)"
                    >
                      {point.month.slice(5)}/{point.month.slice(2, 4)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </section>
  );
}