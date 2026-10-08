import type { Metadata } from "next";
import AdminInventory from "./AdminInventory";

export const metadata: Metadata = {
  title: "Admin Inventory | PK Cycle Mart",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminInventory />;
}
