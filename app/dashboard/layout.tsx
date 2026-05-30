import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayapatri Dashboard",
  robots: "noindex,nofollow",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
