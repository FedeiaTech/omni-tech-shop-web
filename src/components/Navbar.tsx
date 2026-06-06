import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors tracking-wider">
            OMNI TECH
          </Link>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Inicio
            </Link>
            <Link href="/catalogo" className="hover:text-blue-400 transition-colors">
              Catálogo
            </Link>
            <Link href="/institucional" className="hover:text-blue-400 transition-colors">
              Nosotros
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
