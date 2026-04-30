"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/services/login";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PageShell from "@/components/shared/PageShell";
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
    <PageShell
      compact
      showNav={false}
      eyebrow="GrocerIQ"
      title="Login"
      subtitle="Sign in to continue tracking grocery prices."
    >
      <ErrorMessage message={error} />
      <form className={styles.authCard} onSubmit={handleSubmit}>
        <label>
          <span>Username</span>
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <Link className={styles.authLink} href="/register">
        Create an account
      </Link>
    </PageShell>
  );
}
