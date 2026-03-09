export type IProduct = {
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  mainImage: string;
  images: string[];
  rating: number;
  reviews_count: number;
  description: string;
  details: string;
  stock: number;
};