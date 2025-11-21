export type SizeStock = {
  size: string;
  stock: number;
};

export type Products = {
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  size: SizeStock[];
  target: string;
  thumbnail: string;
  discount: number;
};

export type ProductsWithId = Products & {id: string};
