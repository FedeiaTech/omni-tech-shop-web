"use client";

import type { Product } from "@/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  function handleWhatsAppContact() {
    const message = encodeURIComponent(
      `Hola, me interesa el producto:\n\n${product.name}\n\nCódigo: ${product.id}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  }

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-100">
      <div className="bg-gray-100 h-48 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Imagen del producto</span>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">
            {product.name}
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
