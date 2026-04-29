"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { getDashboard } from "@/services/dashboard";
import type { DashboardData } from "@/types/dashboard";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Nav from "@/components/shared/Nav";
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
      <main className={styles.page}>
        <ErrorMessage message={error} />
        {!error && <p>Loading...</p>}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Nav />
      <h2>Dashboard</h2>
      <p>Welcome, {data.loggedInUser.firstName}!</p>
      <ErrorMessage message={error} />

      <h3>Featured Products</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Size</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.featuredProducts.map((product) => (
            <tr key={product.productId}>
              <td>{product.productName}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                {product.unitSize} {product.unitType}
              </td>
              <td>
                <Link href={`/products/${product.productId}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Price Alerts</h3>
      <p>These products are currently priced below their 12-month average!</p>
      <table border={1}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Store</th>
            <th>Chain</th>
            <th>Current Price</th>
            <th>Avg Price</th>
            <th>% Below Avg</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {data.priceAlerts.map((alert) => (
            <tr key={`${alert.productId}-${alert.storeName}`}>
              <td>{alert.productName}</td>
              <td>{alert.storeName}</td>
              <td>{alert.chain}</td>
              <td>${alert.currentPrice}</td>
              <td>${alert.avgPrice}</td>
              <td>{alert.pctBelowAvg}% off</td>
              <td>
                <Link href={`/products/${alert.productId}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
