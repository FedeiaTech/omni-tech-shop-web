export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  isFeatured: boolean;
  image: string;
  specs: string[];
  description?: string;
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
