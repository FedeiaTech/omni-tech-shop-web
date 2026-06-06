"use client";

import { useProducts } from "@/hooks/useProducts";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ProductList from "./ProductList";

export default function CatalogClient() {
  const {
    filteredProducts,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
  } = useProducts();

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="mb-8">
        <FilterBar active={activeCategory} onChange={setActiveCategory} />
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {filteredProducts.length}{" "}
        {filteredProducts.length === 1
          ? "producto encontrado"
          : "productos encontrados"}
      </p>

      <ProductList products={filteredProducts} />
    </>
  );
}
