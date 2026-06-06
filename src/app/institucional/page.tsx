import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia, misión y visión de Omni Tech. Contactanos para consultas y asesoramiento personalizado.",
};

export default function InstitucionalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">Nosotros</h1>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Historia</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Omni Tech nació con la visión de acercar la tecnología a todos,
            ofreciendo productos de calidad con asesoramiento real y precios
            competitivos.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Misión</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Facilitar el acceso a tecnología de punta mediante un catálogo
            amplio, atención personalizada y una experiencia de compra simple y
            confiable.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Visión</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Convertirnos en el referente digital de tecnología en Argentina,
            conectando a cada cliente con el producto ideal para sus
            necesidades.
          </p>
        </div>
      </div>

      <ContactForm />
    </div>
  );
}
