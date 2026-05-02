"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { getProductDetail } from "@/services/product-detail";
import type { ProductDetailData } from "@/types/product-detail";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import PriceHistoryList from "./PriceHistoryList";
import ProductSummary from "./ProductSummary";
import PriceStatsBar from "./PriceStatsBar";
import MonthlyHistoryChart from "./MonthlyHistoryChart";

type ProductDetailPageProps = {
  productId: number;
};

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter();
  const [data, setData] = useState<ProductDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setData(await getProductDetail(productId));
      } catch (caught) {
        if (isUnauthorizedError(caught)) {
          router.push("/login");
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load product.");
      }
    }

    loadProduct();
  }, [productId, router]);

  if (!data) {
    return (
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading product prices" />}
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={data.product.category}
      title={data.product.productName}
      subtitle="Review product details and historical pricing by store."
    >
      <ErrorMessage message={error} />
      <ProductSummary product={data.product} />
      <PriceStatsBar
        weekHigh={data.weekHigh}
        weekLow={data.weekLow}
        predictedPrice={data.predictedPrice}
      />
      <MonthlyHistoryChart history={data.monthlyHistory} />
      <PriceHistoryList prices={data.prices} />
      <Link className="button-link secondary" href="/products">
        Back to products
      </Link>
    </PageShell>
  );
}
