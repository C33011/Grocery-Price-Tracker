"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUnauthorizedError } from "@/lib/api";
import { createPost, getForum } from "@/services/forum";
import type { ForumData } from "@/types/forum";
import ErrorMessage from "@/components/shared/ErrorMessage";
import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";
import SectionHeader from "@/components/shared/SectionHeader";
import ForumPostList from "./ForumPostList";
import PostComposer from "./PostComposer";

export default function ForumPage() {
  const router = useRouter();
  const [data, setData] = useState<ForumData | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadForum() {
    try {
      setData(await getForum());
      setError(null);
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load forum.");
    }
  }

  useEffect(() => {
    loadForum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await createPost({ title, body });
      setTitle("");
      setBody("");
      await loadForum();
    } catch (caught) {
      if (isUnauthorizedError(caught)) {
        router.push("/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not create post.");
    }
  }

  if (!data) {
    return (
      <PageShell>
        <ErrorMessage message={error} />
        {!error && <LoadingState title="Loading forum posts" />}
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Community"
      title="Forum"
      subtitle="Share local grocery notes, price sightings, and practical shopping context."
    >
      <ErrorMessage message={error} />
      <section>
        <SectionHeader title="New post" description="Add a concise update for other shoppers." />
        <PostComposer
          title={title}
          body={body}
          onTitleChange={setTitle}
          onBodyChange={setBody}
          onSubmit={handleCreatePost}
        />
      </section>
      <ForumPostList posts={data.posts} />
    </PageShell>
  );
}
