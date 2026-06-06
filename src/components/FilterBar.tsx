"use client";

import type { Category } from "@/types";

const CATEGORIES: Category[] = [
  "Todos",
  "Componentes",
  "Almacenamiento",
  "Periféricos",
  "Monitores",
  "Redes",
  "Accesorios",
];

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function FilterBar({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          aria-pressed={active === category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === category
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
