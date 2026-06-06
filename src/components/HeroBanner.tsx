import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="Omni Tech"
            width={600}
            height={440}
            className="w-48 sm:w-56 md:w-64 h-auto"
            priority
          />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Tu tecnología,{" "}
          <span className="text-blue-400">sin límites.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Explorá nuestro catálogo de componentes, periféricos y accesorios de
          las mejores marcas. Asesoramiento personalizado y entrega inmediata.
        </p>
        <Link
          href="/catalogo"
          className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-colors shadow-lg shadow-blue-900/40"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
