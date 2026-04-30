"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { getDashboard } from "@/services/dashboard";
import type { DashboardData } from "@/types/dashboard";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import FeaturedProducts from "./FeaturedProducts";
import PriceAlerts from "./PriceAlerts";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setData(await getDashboard());
      } catch (caught) {
        if (isUnauthorizedError(caught)) {
          router.push("/login");
          return;
        }
        setError(caught instanceof Error ? caught.message : "Could not load dashboard.");
      }
    }

    loadDashboard();
  }, [router]);

  if (!data) {
    return (
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading dashboard" />}
      </PageShell>
    );
  }

  return (
    <PageShell title={`Welcome, ${data.loggedInUser.firstName}`}>
      <ErrorMessage message={error} />
      <div className={styles.dashboardSections}>
        <FeaturedProducts products={data.featuredProducts} />
      </div>
      <PriceAlerts alerts={data.priceAlerts} />
    </PageShell>
  );
}
