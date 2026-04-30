"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import {
  addListItem,
  getListDetail,
  removeListItem,
  updateListItemChecked,
} from "@/services/list-detail";
import type { ListDetailData } from "@/types/list-detail";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import AddItemForm from "./AddItemForm";
import ListItemCollection from "./ListItemCollection";

type ListDetailPageProps = {
  listId: number;
};

export default function ListDetailPage({ listId }: ListDetailPageProps) {
  const router = useRouter();
  const [data, setData] = useState<ListDetailData | null>(null);
  const [productId, setProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  async function loadList() {
    try {
      const response = await getListDetail(listId);
      setData(response);
      setProductId((current) => current || response.allProducts[0]?.productId || "");
      setError(null);
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load list.");
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId]);

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!productId) {
      setError("Choose a product.");
      return;
    }

    try {
      await addListItem(listId, { productId, quantity });
      await loadList();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not add item.");
    }
  }

  async function handleToggle(itemId: number, checked: boolean) {
    setError(null);

    try {
      await updateListItemChecked(listId, itemId, { checked });
      await loadList();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not update item.");
    }
  }

  async function handleRemove(itemId: number) {
    setError(null);

    try {
      await removeListItem(listId, itemId);
      await loadList();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not remove item.");
    }
  }

  if (!data) {
    return (
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading list details" />}
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Shopping list"
      title={data.list.listName}
      subtitle="Add products, check off what is in the cart, and remove anything you no longer need."
    >
      <ErrorMessage message={error} />
      <AddItemForm
        products={data.allProducts}
        productId={productId}
        quantity={quantity}
        onProductChange={setProductId}
        onQuantityChange={setQuantity}
        onSubmit={handleAddItem}
      />
      <ListItemCollection items={data.items} onToggle={handleToggle} onRemove={handleRemove} />
      <Link className="button-link secondary" href="/lists">
        Back to lists
      </Link>
    </PageShell>
  );
}
