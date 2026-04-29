"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { archiveList, createList, getLists } from "@/services/lists";
import type { ListsData } from "@/types/lists";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Nav from "@/components/shared/Nav";
import styles from "./ListsPage.module.css";

export default function ListsPage() {
  const router = useRouter();
  const [data, setData] = useState<ListsData | null>(null);
  const [listName, setListName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadLists() {
    try {
      setData(await getLists());
      setError(null);
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load lists.");
    }
  }

  useEffect(() => {
    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await createList({ listName });
      setListName("");
      await loadLists();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not create list.");
    }
  }

  async function handleArchive(listId: number) {
    setError(null);

    try {
      await archiveList(listId);
      await loadLists();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not archive list.");
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

  const activeLists = data.lists.filter((list) => list.active);
  const archivedLists = data.lists.filter((list) => !list.active);

  return (
    <main className={styles.page}>
      <Nav />
      <h2>My Shopping Lists</h2>
      <ErrorMessage message={error} />

      <form onSubmit={handleCreate}>
        <input
          name="listName"
          type="text"
          placeholder="New list name"
          value={listName}
          onChange={(event) => setListName(event.target.value)}
          required
        />
        <button type="submit">Create List</button>
      </form>

      <h3>Active Lists</h3>
      <ul>
        {activeLists.map((list) => (
          <li key={list.listId}>
            <Link href={`/lists/${list.listId}`}>{list.listName}</Link> ({list.createdAt}){" "}
            <button type="button" onClick={() => handleArchive(list.listId)}>
              Archive
            </button>
          </li>
        ))}
      </ul>

      <h3>Archived Lists</h3>
      <ul>
        {archivedLists.map((list) => (
          <li key={list.listId}>
            {list.listName} ({list.createdAt})
          </li>
        ))}
      </ul>
    </main>
  );
}
