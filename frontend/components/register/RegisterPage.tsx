"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { register } from "@/services/register";
import ErrorMessage from "@/components/shared/ErrorMessage";
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
    <main className={styles.page}>
      <h2>Register</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" />
        <br />
        <input name="lastName" type="text" placeholder="Last Name" />
        <br />
        <input name="username" type="text" placeholder="Username" />
        <br />
        <input name="email" type="email" placeholder="Email" />
        <br />
        <input name="password" type="password" placeholder="Password" />
        <br />
        <input name="passwordRepeat" type="password" placeholder="Repeat Password" />
        <br />
        <button type="submit">Register</button>
      </form>
      <Link href="/login">Back to Login</Link>
    </main>
  );
}
