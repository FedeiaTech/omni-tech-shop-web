import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const logoSvg = readFileSync(join(process.cwd(), "public/logo.svg"));
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
          gap: 32,
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          width={320}
          height={235}
          style={{ objectFit: "contain" }}
        />

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#3b82f6",
            borderRadius: 2,
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: "#bfdbfe",
            margin: 0,
            letterSpacing: 1,
          }}
        >
          Catálogo tecnológico · Componentes · Periféricos · Accesorios
        </p>

        {/* URL */}
        <p
          style={{
            fontSize: 20,
            color: "#60a5fa",
            margin: 0,
            opacity: 0.8,
          }}
        >
          omni-tech-shop.vercel.app
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
