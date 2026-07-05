import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

type ImageRow = {
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  is_featured: boolean;
  specs: string[];
  description: string | null;
  product_images: ImageRow[];
};

function mapRow(row: ProductRow): Product {
  const images = [...row.product_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      url: img.url,
      alt: img.alt ?? undefined,
      isPrimary: img.is_primary,
    }));

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    currency: row.currency,
    isFeatured: row.is_featured,
    specs: row.specs,
    description: row.description ?? undefined,
    images,
  };
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt, is_primary, sort_order)")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as ProductRow[]).map(mapRow);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(url, alt, is_primary, sort_order)")
    .eq("id", id)
    .maybeSingle();

  // maybeSingle() returns one row or null (not an error) when nothing matches.
  if (error) throw new Error(error.message);
  return data ? mapRow(data as ProductRow) : null;
}
