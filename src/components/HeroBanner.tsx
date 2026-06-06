"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

const TOTAL = 200;
const TIME = 10;

interface Triangle {
  id: number;
  size: number;
  rotate: number;
  tx: number;
  ty: number;
  hue: number;
  delay: number;
}

function generateTriangles(): Triangle[] {
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: i + 1,
    size: Math.floor(Math.random() * 50) + 1,
    rotate: Math.floor(Math.random() * 360),
    tx: Math.floor(Math.random() * 2000) - 1000,
    ty: Math.floor(Math.random() * 2000) - 1000,
    hue: Math.floor(Math.random() * 360),
    delay: (i + 1) * -(TIME / TOTAL),
  }));
}

export default function HeroBanner() {
  const triangles = useMemo(() => generateTriangles(), []);

  const keyframes = useMemo(
    () =>
      triangles
        .map(
          (t) => `
        @keyframes tri${t.id} {
          0%   { opacity:1; transform: rotate(${t.rotate}deg) translate3d(0,0,-1500px) scale(1); }
          100% { opacity:1; transform: rotate(${t.rotate * 1.5}deg) translate3d(${t.tx}px,${t.ty}px,1000px) scale(1); }
        }`
        )
        .join("\n"),
    [triangles]
  );

  return (
    <section
      className="relative w-full overflow-hidden flex justify-center items-center"
      style={{ minHeight: "100vh", perspective: "800px" }}
    >
      {/* Particle field */}
      <style>{keyframes}</style>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #1e3a8a 0%, #0f172a 40%, #000 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {triangles.map((t) => (
          <div
            key={t.id}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              borderTop: `${t.size}px solid hsla(${t.hue},5%,30%,0.25)`,
              borderLeft: `${t.size}px solid transparent`,
              borderRight: `${t.size}px solid transparent`,
              marginLeft: -t.size / 2,
              marginTop: -t.size / 2,
              filter: "grayscale(1)",
              opacity: 0,
              animation: `tri${t.id} ${TIME}s infinite linear`,
              animationDelay: `${t.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 py-24 gap-6">
        <Image
          src="/logo.svg"
          alt="Omni Tech"
          width={600}
          height={440}
          className="w-48 sm:w-56 md:w-64 h-auto"
          priority
        />

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Tu tecnología,{" "}
          <span className="text-blue-300">sin límites.</span>
        </h1>

        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl">
          Explorá nuestro catálogo de componentes, periféricos y accesorios de
          las mejores marcas. Asesoramiento personalizado y entrega inmediata.
        </p>

        <Link
          href="/catalogo"
          className="mt-2 inline-block bg-white text-blue-700 hover:bg-blue-50 font-semibold py-4 px-10 rounded-xl text-lg transition-colors shadow-lg"
        >
          Ver catálogo
        </Link>
      </div>
    </section>
  );
}
