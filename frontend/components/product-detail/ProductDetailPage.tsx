"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { getProductDetail } from "@/services/product-detail";
import type { ProductDetailData } from "@/types/product-detail";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Nav from "@/components/shared/Nav";
import styles from "./ProductDetailPage.module.css";

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
      <main className={styles.page}>
        <ErrorMessage message={error} />
        {!error && <p>Loading...</p>}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Nav />
      <ErrorMessage message={error} />
      <h2>{data.product.productName}</h2>
      <p>Category: {data.product.category}</p>
      <p>Brand: {data.product.brand}</p>
      <p>
        Size: {data.product.unitSize} {data.product.unitType}
      </p>

      <h3>Price History</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>Store</th>
            <th>Chain</th>
            <th>Price</th>
            <th>Reg Price</th>
            <th>On Sale</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.prices.map((price) => (
            <tr key={price.recordId}>
              <td>{price.storeName}</td>
              <td>{price.chain}</td>
              <td>${price.price}</td>
              <td>${price.regPrice}</td>
              <td>{price.sale ? "Yes" : "No"}</td>
              <td>{price.priceDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/products">Back to Products</Link>
    </main>
  );
}
