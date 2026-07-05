"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";

export default function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
        <span className="text-sm text-gray-400">Sin imágenes</span>
      </div>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={current.url}
          alt={current.alt ?? name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={i === active}
                className={`relative block h-16 w-16 overflow-hidden rounded-md border ${
                  i === active ? "border-gray-900" : "border-gray-200"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
