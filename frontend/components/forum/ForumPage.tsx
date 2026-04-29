"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUnauthorizedError } from "@/lib/api";
import { createPost, getForum } from "@/services/forum";
import type { ForumData } from "@/types/forum";
import ErrorMessage from "@/components/shared/ErrorMessage";
import Nav from "@/components/shared/Nav";
import styles from "./ForumPage.module.css";

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
      <main className={styles.page}>
        <ErrorMessage message={error} />
        {!error && <p>Loading...</p>}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Nav />
      <h2>Community Forum</h2>
      <ErrorMessage message={error} />

      <h3>New Post</h3>
      <form onSubmit={handleCreatePost}>
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <br />
        <textarea
          name="body"
          rows={4}
          cols={50}
          placeholder="Body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <br />
        <button type="submit">Post</button>
      </form>

      <h3>Posts</h3>
      {data.posts.map((post) => (
        <article key={post.postId}>
          <strong>{post.title}</strong> by {post.username} at {post.postedAt}
          <br />
          {post.body}
        </article>
      ))}
    </main>
  );
}
