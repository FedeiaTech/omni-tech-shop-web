export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm">
            &copy; {year} Omni Tech. Todos los derechos reservados.
          </p>
          <p className="text-xs">
            Tecnología al alcance de todos · Un proyecto de{" "}
            <a
              href="https://iatechweb.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 transition-colors hover:text-white"
            >
              IA Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
