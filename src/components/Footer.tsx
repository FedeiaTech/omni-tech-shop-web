export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {year} Omni Tech. Todos los derechos reservados.
          </p>
          <p className="text-xs">
            Tecnología al alcance de todos.
          </p>
        </div>
      </div>
    </footer>
  );
}
