import type { SupabaseClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGES_BUCKET = "product-images";
export const MAX_IMAGES_PER_PRODUCT = 5;

// Two-step upload: push the binary to Storage, then store its public URL as a
// row in product_images. Shared by the create (staged) and edit flows.
export async function uploadProductImage(
  supabase: SupabaseClient,
  productId: string,
  file: File,
  sortOrder: number,
  isPrimary: boolean
): Promise<void> {
  const path = `${productId}/${crypto.randomUUID()}-${file.name}`;
  const { error: upErr } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file);
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);
  const { error: insErr } = await supabase.from("product_images").insert({
    product_id: productId,
    url: pub.publicUrl,
    sort_order: sortOrder,
    is_primary: isPrimary,
  });
  if (insErr) throw insErr;
}

// The stored file path lives inside the public URL, after the bucket segment.
export function storagePathFromPublicUrl(url: string): string {
  const marker = `/${PRODUCT_IMAGES_BUCKET}/`;
  return url.slice(url.indexOf(marker) + marker.length);
}
