import type { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProductsGrid from "@/components/FeaturedProductsGrid";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inicio",
};

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.isFeatured);

  return (
    <>
      <HeroBanner />
      <FeaturedProductsGrid products={featured} />
      <section className="py-12 text-center px-4">
        <Link
          href="/catalogo"
          className="inline-block border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold py-3 px-8 rounded-xl text-base transition-colors"
        >
          Ver todo el catálogo
        </Link>
      </section>
    </>
  );
}
