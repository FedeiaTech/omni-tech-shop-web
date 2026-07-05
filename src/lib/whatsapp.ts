const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

// Builds a wa.me checkout link with the product prefilled in the message.
// Shared by the catalog card and the product detail page.
export function buildWhatsAppUrl(product: {
  id: string;
  name: string;
}): string {
  const message = encodeURIComponent(
    `Hola, me interesa el producto:\n\n${product.name}\n\nCódigo: ${product.id}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
