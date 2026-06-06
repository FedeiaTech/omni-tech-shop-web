"use client";

import { useMemo, useState } from "react";
import productsData from "@/data/products.json";
import type { Category, Product } from "@/types";

export function useProducts() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const products: Product[] = productsData as Product[];

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) =>
        activeCategory === "Todos" ? true : item.category === activeCategory
      )
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.specs.some((s) => s.toLowerCase().includes(term))
        );
      });
  }, [products, activeCategory, searchTerm]);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.isFeatured),
    [products]
  );

  return {
    products,
    filteredProducts,
    featuredProducts,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
  };
}
