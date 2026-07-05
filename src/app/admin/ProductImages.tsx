"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import FilePickerButton from "./FilePickerButton";
import {
  MAX_IMAGES_PER_PRODUCT,
  PRODUCT_IMAGES_BUCKET,
  storagePathFromPublicUrl,
  uploadProductImage,
} from "@/lib/productImages";
import type { Product } from "@/types";

export default function ProductImages({ product }: { product: Product }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const existingCount = product.images.length;
  const remaining = MAX_IMAGES_PER_PRODUCT - existingCount;

  async function handleSelect(files: FileList) {
    const toUpload = Array.from(files).slice(0, Math.max(0, remaining));
    if (toUpload.length === 0) return;

    setUploading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();

    try {
      for (let i = 0; i < toUpload.length; i++) {
        await uploadProductImage(
          supabase,
          product.id,
          toUpload[i],
          existingCount + i,
          existingCount === 0 && i === 0
        );
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al subir la imagen."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage(url: string) {
    if (!window.confirm("¿Borrar esta imagen?")) return;
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const path = storagePathFromPublicUrl(url);

    // Two systems, two deletes: remove the DB row and the stored file.
    const { error: rowErr } = await supabase
      .from("product_images")
      .delete()
      .eq("url", url);
    if (rowErr) {
      setError(rowErr.message);
      return;
    }
    const { error: fileErr } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([path]);
    if (fileErr) {
      setError(fileErr.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="border-t border-gray-200 pt-4 sm:col-span-2">
      <h3 className="mb-3 text-sm font-medium text-gray-700">
        Imágenes ({existingCount}/{MAX_IMAGES_PER_PRODUCT})
      </h3>

      {existingCount > 0 ? (
        <ul className="mb-4 flex flex-wrap gap-3">
          {product.images.map((img) => (
            <li key={img.url} className="relative">
              <Image
                src={img.url}
                alt={img.alt ?? product.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-md border border-gray-200 object-cover"
              />
              {img.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDeleteImage(img.url)}
                aria-label="Borrar imagen"
                className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-gray-400">Sin imágenes todavía.</p>
      )}

      <FilePickerButton
        label="Agregar imágenes"
        onSelect={handleSelect}
        disabled={uploading || remaining <= 0}
      />
      <p className="mt-2 text-xs text-gray-400">
        {remaining > 0
          ? `Podés agregar ${remaining} más (máximo ${MAX_IMAGES_PER_PRODUCT}).`
          : `Alcanzaste el máximo de ${MAX_IMAGES_PER_PRODUCT} imágenes.`}
      </p>
      {uploading && <p className="mt-2 text-sm text-gray-500">Subiendo…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
