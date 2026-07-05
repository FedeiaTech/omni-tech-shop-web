import type { Metadata } from "next";
import CatalogClient from "@/components/CatalogClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explorá todos nuestros productos: componentes, periféricos, monitores, almacenamiento y más.",
};

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Catálogo</h1>
      <CatalogClient products={products} />
    </div>
  );
}
