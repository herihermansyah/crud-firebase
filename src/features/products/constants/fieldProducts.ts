import {Products} from "../types/products.types";

export const field: {key: keyof Products; label: string; type: string}[] = [
  {key: "title", label: "title", type: "text"},
  {key: "description", label: "description", type: "text"},
  {key: "price", label: "price", type: "number"},
  {key: "discount", label: "discount", type: "number"},
  {key: "rating", label: "rating", type: "number"},
];

export const selectField: {
  key: keyof Products;
  label: string;
  type: string;
  value?: string[];
}[] = [
  {
    key: "category",
    label: "category",
    type: "text",
    value: [
      "kemeja",
      "kaos",
      "jeans",
      "dress",
      "blazer",
      "rok",
      "seragam",
      "romper",
    ],
  },
  {
    key: "target",
    label: "target",
    type: "text",
    value: ["men", "women", "kids"],
  },
];

export const sizes = ["s", "m", "l", "xl", "2xl"];
