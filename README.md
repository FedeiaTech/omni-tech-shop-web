# Omni Tech — Catálogo Tecnológico Web

Tienda web full-stack para la venta de productos tecnológicos: catálogo público con galería de imágenes por producto, panel de administración protegido y cierre de venta por WhatsApp. Construida sobre Next.js y Supabase.

## Sobre el proyecto

Omni Tech es una tienda especializada en componentes, periféricos, almacenamiento, monitores y accesorios tecnológicos. La plataforma permite explorar el catálogo, filtrar y buscar productos, ver el detalle de cada uno con su galería de imágenes y consultar por WhatsApp. Un panel de administración protegido permite gestionar productos e imágenes sin tocar código.

## Funcionalidades

- Catálogo con filtrado por categoría y búsqueda en tiempo real
- Página de detalle por producto (`/producto/[id]`) con galería navegable
- Productos destacados en la página principal
- Panel de administración (`/admin`) con login protegido: alta, edición y baja de productos, y subida/borrado de imágenes
- Datos e imágenes servidos desde Supabase (Postgres + Storage)
- Autorización a nivel de base de datos con Row Level Security: lectura pública, escritura solo autenticada
- Cierre de venta por WhatsApp con el producto precargado
- SEO: metadata dinámica, Open Graph, sitemap XML y robots.txt
- Diseño responsive para mobile, tablet y desktop
- Headers de seguridad configurados (CSP, X-Frame-Options, etc.)

## Stack tecnológico

- **Framework**: Next.js 15+ (App Router)
- **UI**: React 19+ con TypeScript
- **Estilos**: Tailwind CSS v4
- **Backend**: Supabase — Postgres (datos), Storage (imágenes), Auth (admin), RLS (autorización)
- **Cliente Supabase**: `@supabase/ssr` (Server + Client Components)
- **Linting**: ESLint + Prettier
- **Hosting**: Vercel

## Variables de entorno

Creá un archivo `.env.local` en la raíz (no se versiona) con:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
NEXT_PUBLIC_WHATSAPP_NUMBER=5491100000000
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key>
```

> `NEXT_PUBLIC_SUPABASE_URL` es la URL base del proyecto, sin el sufijo `/rest/v1/`.

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda en `http://localhost:3000`. El panel de administración vive en `/admin`; el usuario admin se crea a mano desde el dashboard de Supabase (el registro público está deshabilitado).

## Estructura del proyecto

```
src/
├── app/
│   ├── admin/         # Panel protegido: login, CRUD y gestión de imágenes
│   ├── producto/[id]/ # Página de detalle con galería
│   ├── catalogo/      # Catálogo completo
│   └── page.tsx       # Home + destacados
├── components/        # Componentes reutilizables
├── hooks/             # Custom hooks (filtrado del catálogo)
├── lib/
│   ├── supabase/      # Clientes server/browser y middleware de sesión
│   ├── products.ts    # Acceso a datos (getProducts, getProductById)
│   ├── productImages.ts
│   └── whatsapp.ts
└── types/             # Tipos TypeScript
```

## Gestión de productos

Los productos y sus imágenes se administran desde el panel `/admin`. Cada producto vive en la tabla `products` de Postgres; sus imágenes en la tabla `product_images` (relación uno-a-muchos), con los archivos guardados en un bucket de Supabase Storage. La escritura está protegida por políticas RLS: solo un usuario autenticado puede crear, editar o borrar.

## Mantenimiento (Supabase free tier)

El plan gratuito de Supabase pausa el proyecto tras ~1 semana de inactividad. El workflow `.github/workflows/keep-alive.yml` hace un ping cada 3 días para mantenerlo activo. Requiere cargar en **Settings → Secrets and variables → Actions** los secrets `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

---

## Derechos de autor

&copy; 2025 Omni Tech. Todos los derechos reservados.

Este software y su código fuente son propiedad exclusiva de Omni Tech. Queda prohibida su reproducción, distribución o modificación total o parcial sin autorización expresa y por escrito del titular de los derechos.
