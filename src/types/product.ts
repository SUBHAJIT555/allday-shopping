export type Product = {
  id: number;
  title: string;
  categoryId: number;
  img: string;
  price: number;
  discountedPrice: number;
  reviews: number;
  description: string;
  isNewArrival: boolean;
  isBestSelling: boolean;
  isTrending: boolean;
  rating: number;
  inStock: boolean;
};
