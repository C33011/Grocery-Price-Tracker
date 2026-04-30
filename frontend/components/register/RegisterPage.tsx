"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/services/register";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PageShell from "@/components/shared/PageShell";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      await register({
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        username: String(formData.get("username") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        passwordRepeat: String(formData.get("passwordRepeat") ?? ""),
      });
      router.push("/login");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Registration failed.");
    }
  }

  return (
    <PageShell
      compact
      showNav={false}
      eyebrow="GrocerIQ"
      title="Register"
      subtitle="Create an account for grocery price tracking."
    >
      <ErrorMessage message={error} />
      <form className={styles.authCard} onSubmit={handleSubmit}>
        <label>
          <span>First name</span>
          <input name="firstName" type="text" placeholder="First name" />
        </label>
        <label>
          <span>Last name</span>
          <input name="lastName" type="text" placeholder="Last name" />
        </label>
        <label>
          <span>Username</span>
          <input name="username" type="text" placeholder="Username" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" placeholder="Password" />
        </label>
        <label>
          <span>Repeat password</span>
          <input name="passwordRepeat" type="password" placeholder="Repeat password" />
        </label>
        <button type="submit">Register</button>
      </form>
      <Link className={styles.authLink} href="/login">
        Back to login
      </Link>
    </PageShell>
  );
}
