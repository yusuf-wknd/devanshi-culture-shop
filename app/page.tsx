import { redirect } from "next/navigation";

// Root page redirects to default language
// The middleware should handle this, but this provides a fallback
export default function RootPage() {
  redirect('/en');
}
