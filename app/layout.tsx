import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devanshi Culture Shop",
  description:
    "Discover authentic cultural products and heritage items at Devanshi Culture Shop",
};

// Root layout now redirects to language-specific routes
// The actual layout with fonts is handled in [lang]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout should only handle redirects
  // All actual HTML structure is in [lang]/layout.tsx
  return children;
}
