"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { addProductsToList, getProducts } from "@/services/products";
import type { ProductFilters, ProductsData } from "@/types/products";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import SectionHeader from "@/components/shared/SectionHeader";
import StatusMessage from "@/components/shared/StatusMessage";
import AddToListBar from "./AddToListBar";
import ProductFiltersForm from "./ProductFilters";
import ProductGrid from "./ProductGrid";

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
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading products" />}
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Catalog"
      title="Products"
      subtitle="Search the grocery catalog and send products directly into a shopping list."
    >
      <ErrorMessage message={error} />
      <StatusMessage message={message} tone="success" />
      <ProductFiltersForm filters={filters} onChange={setFilters} onSubmit={handleFilterSubmit} />
      <section>
        <SectionHeader
          title="Tracked products"
          description={`${data.products.length} products match the current filters.`}
        />
        <ProductGrid
          products={data.products}
          selectedProductIds={selectedProductIds}
          onToggleProduct={toggleProduct}
        />
      </section>
      <AddToListBar
        lists={data.userLists}
        selectedCount={selectedProductIds.length}
        selectedListId={selectedListId}
        onSelectedListChange={setSelectedListId}
        onSubmit={handleAddToList}
      />
    </PageShell>
  );
}
