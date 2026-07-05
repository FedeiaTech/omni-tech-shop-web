"use client";

import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  // Show the primary image, falling back to the first, then a placeholder.
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];

  const detailHref = `/producto/${product.id}`;

  function handleWhatsAppContact() {
    window.open(buildWhatsAppUrl(product), "_blank");
  }

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100">
      <Link href={detailHref} className="relative block h-48 bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-gray-400">Imagen del producto</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            <Link href={detailHref} className="hover:text-blue-700">
              {product.name}
            </Link>
          </h3>
          {product.isFeatured && (
            <span className="shrink-0 text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
              Destacado
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded-full">
          {product.category}
        </span>

        <ul className="flex flex-wrap gap-1.5">
          {product.specs.map((spec) => (
            <li
              key={spec}
              className="text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded"
            >
              {spec}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xl font-bold text-gray-900">
            {product.currency} {product.price.toLocaleString()}
          </p>
          <button
            onClick={handleWhatsAppContact}
            className="bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            aria-label={`Consultar por ${product.name} por WhatsApp`}
          >
            Consultar
          </button>
        </div>
      </div>
    </article>
  );
}
