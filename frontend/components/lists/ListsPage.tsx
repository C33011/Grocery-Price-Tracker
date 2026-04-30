"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { isUnauthorizedError } from "@/lib/api";
import { archiveList, createList, getLists } from "@/services/lists";
import type { ListsData } from "@/types/lists";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import CreateListForm from "./CreateListForm";
import ListCollection from "./ListCollection";

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
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading lists" />}
      </PageShell>
    );
  }

  const activeLists = data.lists.filter((list) => list.active);
  const archivedLists = data.lists.filter((list) => !list.active);

  return (
    <PageShell
      eyebrow="Lists"
      title="Shopping lists"
      subtitle="Create focused grocery runs and archive lists when the work is done."
    >
      <ErrorMessage message={error} />
      <CreateListForm
        listName={listName}
        onListNameChange={setListName}
        onSubmit={handleCreate}
      />
      <ListCollection
        title="Active lists"
        description="Open lists that are still ready for edits and grocery planning."
        lists={activeLists}
        onArchive={handleArchive}
      />
      <ListCollection
        title="Archived lists"
        description="Past grocery runs kept for reference."
        lists={archivedLists}
        archived
      />
    </PageShell>
  );
}
