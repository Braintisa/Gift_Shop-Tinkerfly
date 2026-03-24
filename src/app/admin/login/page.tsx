import AdminLogin from "@/pages/AdminLogin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}

