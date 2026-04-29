"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/services/login";
import ErrorMessage from "@/components/shared/ErrorMessage";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login({ username, password });
      router.push("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed.");
    }
  }

  return (
    <main className={styles.page}>
      <h2>Login</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <Link href="/register">Register</Link>
    </main>
  );
}
