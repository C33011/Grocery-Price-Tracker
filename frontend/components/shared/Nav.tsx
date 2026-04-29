"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/services/login";

export default function Nav() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <>
      <nav>
        <Link href="/">Home</Link> | <Link href="/products">Products</Link> |{" "}
        <Link href="/lists">My Lists</Link> | <Link href="/forum">Forum</Link> |{" "}
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <hr />
    </>
  );
}
