export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  isFeatured: boolean;
  specs: string[];
  description?: string;
  images: ProductImage[];
}

export type Category =
  | "Todos"
  | "Componentes"
  | "Almacenamiento"
  | "Periféricos"
  | "Monitores"
  | "Redes"
  | "Accesorios";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
