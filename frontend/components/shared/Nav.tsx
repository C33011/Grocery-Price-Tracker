"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/login";
import styles from "./Nav.module.css";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/lists", label: "Lists" },
  { href: "/forum", label: "Forum" },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  }

  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      <Link className={styles.brand} href="/">
        GrocerIQ
      </Link>
      <div className={styles.links}>
        {navItems.map((item) => (
          <Link
            className={`${styles.link} ${
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                ? styles.active
                : ""
            }`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button className={styles.logout} type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
