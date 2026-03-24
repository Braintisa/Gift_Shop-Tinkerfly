import dynamic from "next/dynamic";
import type { Metadata } from "next";

const App = dynamic(() => import("@/App"), { ssr: false });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

// Render the existing react-router-based admin UI inside Next.js.
// This keeps your previous dashboard layout working without rewriting all admin routes.
export default function AdminCatchAllPage() {
  return <App />;
}

