# Omni Tech — Catálogo Tecnológico Web

Plataforma web para la exhibición y promoción de productos tecnológicos mediante un catálogo digital moderno, responsive y optimizado para SEO.

## Sobre el proyecto

Omni Tech es una tienda especializada en componentes, periféricos, almacenamiento, monitores y accesorios tecnológicos. Esta plataforma digital permite explorar el catálogo completo, filtrar por categoría, buscar productos y contactar al equipo de ventas directamente por WhatsApp.

## Funcionalidades

- Catálogo de productos con filtrado por categoría y búsqueda en tiempo real
- Sección de productos destacados en la página principal
- Integración con WhatsApp Business para consultas comerciales
- Página institucional con historia, misión, visión y formulario de contacto
- SEO optimizado: metadata dinámica, Open Graph, sitemap XML y robots.txt
- Diseño responsive para mobile, tablet y desktop
- Headers de seguridad configurados (CSP, X-Frame-Options, etc.)

## Stack tecnológico

- **Framework**: Next.js 15+ (App Router)
- **UI**: React 19+ con TypeScript
- **Estilos**: Tailwind CSS v4
- **Linting**: ESLint + Prettier
- **Hosting**: Vercel

## Variables de entorno

Creá un archivo `.env.local` en la raíz con las siguientes variables:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=5491100000000
```

## Estructura del proyecto

```
src/
├── app/           # Páginas y layouts (App Router)
├── components/    # Componentes reutilizables
├── hooks/         # Custom hooks
├── data/          # products.json — catálogo de productos
├── types/         # Tipos TypeScript
└── assets/        # Imágenes y recursos estáticos
```

## Catálogo de productos

Los productos se gestionan mediante `src/data/products.json`. Para agregar o modificar un producto, editá ese archivo siguiendo la estructura:

```json
{
  "id": "OT-XXXX",
  "name": "Nombre del producto",
  "category": "Componentes",
  "price": 100,
  "currency": "USD",
  "isFeatured": false,
  "image": "/assets/images/producto.png",
  "specs": ["Spec 1", "Spec 2"],
  "description": "Descripción breve."
}
```

**Categorías disponibles**: Componentes, Almacenamiento, Periféricos, Monitores, Redes, Accesorios.

---

## Derechos de autor

&copy; 2025 Omni Tech. Todos los derechos reservados.

Este software y su código fuente son propiedad exclusiva de Omni Tech. Queda prohibida su reproducción, distribución o modificación total o parcial sin autorización expresa y por escrito del titular de los derechos.
