import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import ProductGallery from "./ProductGallery";

// params is a Promise in Next 15 App Router — it must be awaited.
type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description:
      product.description ?? `${product.name} — ${product.category}`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col gap-4">
          {product.isFeatured && (
            <span className="w-fit rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Destacado
            </span>
          )}

          <h1 className="font-display text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <span className="w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {product.category}
          </span>

          <p className="text-3xl font-bold text-gray-900">
            {product.currency} {product.price.toLocaleString()}
          </p>

          {product.description && (
            <p className="text-gray-600">{product.description}</p>
          )}

          {product.specs.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {product.specs.map((spec) => (
                <li
                  key={spec}
                  className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-600"
                >
                  {spec}
                </li>
              ))}
            </ul>
          )}

          <a
            href={buildWhatsAppUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-fit rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-400"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
