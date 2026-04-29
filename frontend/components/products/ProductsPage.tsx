"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { addProductsToList, getProducts } from "@/services/products";
import type { ProductFilters, ProductsData } from "@/types/products";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Nav from "@/components/shared/Nav";
import styles from "./ProductsPage.module.css";

const emptyFilters: ProductFilters = {
  search: "",
  category: "",
  chain: "",
};

export default function ProductsPage() {
  const router = useRouter();
  const [data, setData] = useState<ProductsData | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(emptyFilters);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadProducts(nextFilters = filters) {
    try {
      const response = await getProducts(nextFilters);
      setData(response);
      setSelectedListId((current) => current || response.userLists[0]?.listId || "");
      setError(null);
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load products.");
    }
  }

  useEffect(() => {
    loadProducts(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadProducts(filters);
  }

  async function handleAddToList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedListId) {
      setError("Choose a shopping list.");
      return;
    }

    try {
      const response = await addProductsToList({
        listId: selectedListId,
        productIds: selectedProductIds,
      });
      setSelectedProductIds([]);
      setMessage(response.message);
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not add products.");
    }
  }

  function toggleProduct(productId: number) {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

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
      <h2>Products</h2>
      <ErrorMessage message={error} />
      {message && <p>{message}</p>}

      <form onSubmit={handleFilterSubmit}>
        <input
          name="search"
          type="text"
          placeholder="Search by name"
          value={filters.search}
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(event) => setFilters({ ...filters, category: event.target.value })}
        />
        <input
          name="chain"
          type="text"
          placeholder="Filter by chain"
          value={filters.chain}
          onChange={(event) => setFilters({ ...filters, chain: event.target.value })}
        />
        <button type="submit">Search</button>
      </form>

      <form onSubmit={handleAddToList}>
        <table border={1}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <tr key={product.productId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.productId)}
                    onChange={() => toggleProduct(product.productId)}
                  />
                </td>
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

        <h3>Add to Shopping List</h3>
        <select
          name="listId"
          value={selectedListId}
          onChange={(event) => setSelectedListId(Number(event.target.value))}
        >
          <option value="" disabled>
            Select a list
          </option>
          {data.userLists.map((list) => (
            <option key={list.listId} value={list.listId}>
              {list.listName}
            </option>
          ))}
        </select>
        <button type="submit">Add Selected to List</button>
      </form>
    </main>
  );
}
