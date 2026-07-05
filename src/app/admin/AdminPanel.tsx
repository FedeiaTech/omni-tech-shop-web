"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ProductImages from "./ProductImages";
import FilePickerButton from "./FilePickerButton";
import {
  MAX_IMAGES_PER_PRODUCT,
  PRODUCT_IMAGES_BUCKET,
  uploadProductImage,
} from "@/lib/productImages";
import type { Category, Product } from "@/types";

const CATEGORIES: Exclude<Category, "Todos">[] = [
  "Componentes",
  "Almacenamiento",
  "Periféricos",
  "Monitores",
  "Redes",
  "Accesorios",
];

const CURRENCIES = ["USD", "ARS"] as const;
type Currency = (typeof CURRENCIES)[number];

type FormState = {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  price: string;
  currency: Currency;
  isFeatured: boolean;
  specsText: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  category: "Componentes",
  price: "",
  currency: "USD",
  isFeatured: false,
  specsText: "",
  description: "",
};

// Suggests the next sequential business code (OT-1009, OT-1010, ...) from the
// highest existing OT-#### id. This only removes the manual guesswork — the DB
// primary key remains the real uniqueness guard.
function nextProductCode(products: Product[]): string {
  const highest = products.reduce((max, p) => {
    const match = /^OT-(\d+)$/.exec(p.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);
  return `OT-${highest + 1}`;
}

export default function AdminPanel({
  products,
  userEmail,
}: {
  products: Product[];
  userEmail: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Tracks whether the admin typed their own code, so we stop auto-filling it.
  const [idTouched, setIdTouched] = useState(false);

  // List filters (client-side, like the public catalog's useProducts).
  const [filterCategory, setFilterCategory] = useState<Category>("Todos");
  const [filterCurrency, setFilterCurrency] = useState<"Todas" | Currency>(
    "Todas"
  );
  const [sort, setSort] = useState<"none" | "price-asc" | "price-desc">("none");

  const visibleProducts = useMemo(() => {
    let list = products;

    if (filterCategory !== "Todos") {
      list = list.filter((p) => p.category === filterCategory);
    }
    if (filterCurrency !== "Todas") {
      list = list.filter((p) => p.currency === filterCurrency);
    }

    if (sort === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, filterCategory, filterCurrency, sort]);

  // Staged images for the create flow: held in the browser until the product
  // row exists (product_images.product_id is a FK), then uploaded on submit.
  // Object URLs are created/revoked in the event handlers (never in render), so
  // React StrictMode's double-invoke can't revoke a preview still on screen.
  const [staged, setStaged] = useState<{ file: File; url: string }[]>([]);

  function addStagedFiles(files: FileList) {
    const room = MAX_IMAGES_PER_PRODUCT - staged.length;
    const additions = Array.from(files)
      .slice(0, Math.max(0, room))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setStaged((prev) => [...prev, ...additions]);
  }
  function removeStagedFile(index: number) {
    const target = staged[index];
    if (target) URL.revokeObjectURL(target.url);
    setStaged((prev) => prev.filter((_, i) => i !== index));
  }

  // Revoke any remaining preview URLs when the panel unmounts.
  const stagedRef = useRef(staged);
  stagedRef.current = staged;
  useEffect(() => {
    return () => stagedRef.current.forEach((s) => URL.revokeObjectURL(s.url));
  }, []);

  // Auto-fill the next code while creating, unless the admin overrode it.
  // Recomputes after each create/delete (products changes via router.refresh).
  useEffect(() => {
    if (editingId === null && !idTouched) {
      setForm((f) => ({ ...f, id: nextProductCode(products) }));
    }
  }, [products, editingId, idTouched]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setIdTouched(false);
    staged.forEach((s) => URL.revokeObjectURL(s.url));
    setStaged([]);
  }

  function startEdit(product: Product) {
    // Warn before discarding unsaved staged images from the create form.
    if (staged.length > 0) {
      const ok = window.confirm(
        `Tenés ${staged.length} imagen(es) sin guardar en el producto nuevo. Si editás otro, se descartan. ¿Continuar?`
      );
      if (!ok) return;
      staged.forEach((s) => URL.revokeObjectURL(s.url));
      setStaged([]);
    }
    setEditingId(product.id);
    setError(null);
    setForm({
      id: product.id,
      name: product.name,
      category: product.category as Exclude<Category, "Todos">,
      price: String(product.price),
      currency: (product.currency as Currency) ?? "USD",
      isFeatured: product.isFeatured,
      specsText: product.specs.join("\n"),
      description: product.description ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    // Map the camelCase form to the snake_case DB columns.
    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      currency: form.currency,
      is_featured: form.isFeatured,
      specs: form.specsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description.trim() || null,
    };

    // Friendly client-side duplicate check on create; the DB primary key is
    // the real guard if this list is stale.
    if (!editingId && products.some((p) => p.id === payload.id)) {
      setLoading(false);
      setError(`Ya existe un producto con el código ${payload.id}.`);
      return;
    }

    const { error } = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // On create, upload the staged images now that the product row exists.
    if (!editingId && staged.length > 0) {
      try {
        for (let i = 0; i < staged.length; i++) {
          await uploadProductImage(
            supabase,
            payload.id,
            staged[i].file,
            i,
            i === 0
          );
        }
      } catch (err) {
        setLoading(false);
        setError(
          err instanceof Error
            ? `Producto creado, pero una imagen falló: ${err.message}`
            : "Producto creado, pero una imagen falló."
        );
        router.refresh();
        return;
      }
    }

    setLoading(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm(
        `¿Borrar el producto ${id}? Se borran también sus imágenes.`
      )
    ) {
      return;
    }

    setError(null);
    const supabase = createSupabaseBrowserClient();

    // List the product's files in Storage (grouped under `${id}/`) before we
    // delete the row — the FK cascade drops the DB rows, but never the files.
    const { data: files, error: listErr } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .list(id);
    if (listErr) {
      setError(listErr.message);
      return;
    }

    // Delete the product: the cascade removes its product_images rows.
    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (delErr) {
      setError(delErr.message);
      return;
    }

    // Remove the now-orphaned files from Storage (two systems, two deletes).
    if (files && files.length > 0) {
      const { error: rmErr } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove(files.map((f) => `${id}/${f.name}`));
      if (rmErr) {
        setError(
          `Producto borrado, pero quedaron archivos en Storage: ${rmErr.message}`
        );
        return;
      }
    }

    if (editingId === id) resetForm();
    router.refresh();
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none";

  // Images can only be attached to a product that already exists (FK), so the
  // image manager shows up only while editing.
  const editingProduct = editingId
    ? (products.find((p) => p.id === editingId) ?? null)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Panel de administración
          </h1>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Cerrar sesión
        </button>
      </header>

      {/* Create / edit form */}
      <section className="mb-10 rounded-md border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {editingId ? `Editar producto ${editingId}` : "Nuevo producto"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Código (id)
            </label>
            <input
              value={form.id}
              onChange={(e) => {
                setIdTouched(true);
                setForm({ ...form, id: e.target.value });
              }}
              required
              disabled={editingId !== null}
              placeholder="OT-1009"
              className={`${inputClass} disabled:bg-gray-100`}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as Exclude<Category, "Todos">,
                })
              }
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Moneda
              </label>
              <select
                value={form.currency}
                onChange={(e) =>
                  setForm({ ...form, currency: e.target.value as Currency })
                }
                className={inputClass}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Especificaciones (una por línea)
            </label>
            <textarea
              value={form.specsText}
              onChange={(e) => setForm({ ...form, specsText: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-700">
              Destacado (aparece en la home)
            </label>
          </div>

          {editingProduct ? (
            <ProductImages product={editingProduct} />
          ) : (
            <div className="border-t border-gray-200 pt-4 sm:col-span-2">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                Imágenes ({staged.length}/{MAX_IMAGES_PER_PRODUCT})
              </h3>
              {staged.length > 0 && (
                <ul className="mb-4 flex flex-wrap gap-3">
                  {staged.map((p, i) => (
                    <li key={p.url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={p.file.name}
                        className="h-24 w-24 rounded-md border border-gray-200 object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-gray-900 px-1.5 py-0.5 text-[10px] text-white">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeStagedFile(i)}
                        aria-label="Quitar imagen"
                        className="absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <FilePickerButton
                label="Seleccionar imágenes"
                onSelect={addStagedFiles}
                disabled={staged.length >= MAX_IMAGES_PER_PRODUCT}
              />
              <p className="mt-2 text-xs text-gray-400">
                Se subirán al crear el producto. Máximo{" "}
                {MAX_IMAGES_PER_PRODUCT}.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 sm:col-span-2">{error}</p>
          )}

          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Guardando..."
                : editingId
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Product list */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Productos ({visibleProducts.length}
            {visibleProducts.length !== products.length
              ? ` de ${products.length}`
              : ""}
            )
          </h2>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as Category)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              aria-label="Filtrar por tipo"
            >
              <option value="Todos">Todos los tipos</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterCurrency}
              onChange={(e) =>
                setFilterCurrency(e.target.value as "Todas" | Currency)
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              aria-label="Filtrar por moneda"
            >
              <option value="Todas">Todas las monedas</option>
              <option value="USD">USD (dólar)</option>
              <option value="ARS">ARS (peso)</option>
            </select>
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "none" | "price-asc" | "price-desc")
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
              aria-label="Ordenar por precio"
            >
              <option value="none">Sin orden</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
        <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
          {visibleProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.id} · {product.category} · {product.currency}{" "}
                  {product.price} · {product.images.length} img
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
