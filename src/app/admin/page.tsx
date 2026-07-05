import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/products";
import AdminPanel from "./AdminPanel";

export const metadata: Metadata = {
  title: "Admin",
  // The admin area must never be indexed.
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Real protection lives on the server: no session, no panel.
  if (!user) redirect("/admin/login");

  const products = await getProducts();

  return <AdminPanel products={products} userEmail={user.email ?? ""} />;
}
