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
import Nav from "@/components/shared/Nav";
import styles from "./ListDetailPage.module.css";

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
      <main className={styles.page}>
        <ErrorMessage message={error} />
        {!error && <p>Loading...</p>}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Nav />
      <h2>{data.list.listName}</h2>
      <ErrorMessage message={error} />

      <h3>Add Item</h3>
      <form onSubmit={handleAddItem}>
        <select
          name="productId"
          value={productId}
          onChange={(event) => setProductId(Number(event.target.value))}
        >
          <option value="" disabled>
            Select a product
          </option>
          {data.allProducts.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          type="number"
          value={quantity}
          min="1"
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
        <button type="submit">Add</button>
      </form>

      <h3>Items</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Checked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item) => (
            <tr key={item.itemId}>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.checked ? "Yes" : "No"}</td>
              <td>
                <button type="button" onClick={() => handleToggle(item.itemId, !item.checked)}>
                  Toggle
                </button>{" "}
                <button type="button" onClick={() => handleRemove(item.itemId)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/lists">Back to Lists</Link>
    </main>
  );
}
