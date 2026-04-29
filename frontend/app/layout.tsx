import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrocerIQ",
  description: "Grocery price tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
