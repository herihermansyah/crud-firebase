"use client";

import {db} from "@/lib/firebaseConfig";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {addDoc, collection} from "firebase/firestore";
import {useRouter} from "next/navigation";
import React, {ChangeEvent, FormEvent, useState} from "react";
import {Products} from "../../types/products.types";
import {initialProducts} from "../../constants/initialProducts";
import {field, selectField, sizes} from "../../constants/fieldProducts";
import ButtonBack from "@/components/ui/ButtonBack";
import {motion} from "motion/react";
import {toast} from "react-toastify";

function AddProducts() {
  const [addProduct, setAddProduct] = useState<Products>(initialProducts);

  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = e.target;
    setAddProduct((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelect = (e: SelectChangeEvent<string>) => {
    const {name, value} = e.target;
    setAddProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), addProduct);
      setAddProduct(initialProducts);
      toast.success("data berhasil ditambah");
      router.push("/products");
    } catch {
      toast.error("data gagal ditambah");
    }
  };

  return (
    <div className="container mx-auto px-2 flex flex-col gap-10 ">
      <ButtonBack />
      <motion.div
        initial={{opacity: 0, scale: 0}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.2}}
        className="border border-gray-300 p-5 rounded-2xl shadow-2xl"
      >
        <form className="flex flex-col gap-4" onSubmit={handlAddProduct}>
          {field.map((item, index) => (
            <TextField
              key={index}
              label={item.label}
              name={item.key}
              type={item.type}
              value={addProduct[item.key] || ""}
              onChange={handleChange}
              required
            />
          ))}

          <TextField
            name="discount"
            label="discount"
            type="number"
            value={addProduct.discount}
            onChange={handleChange}
          />

          <TextField
            name="thumbnail"
            label="thumbnail"
            type="text"
            value={addProduct.thumbnail}
            onChange={handleChange}
          />
          <div className="border border-gray-300 rounded-md p-5">
            <h3 className="mb-5 capitalize">size</h3>
            <div className="border flex flex-wrap items-center border-gray-300">
              {sizes.map((sz) => {
                const existing = addProduct.size.find((s) => s.size === sz);

                return (
                  <div key={sz} className="p-4">
                    <div className="flex items-center">
                      <Checkbox
                        checked={!!existing}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAddProduct((prev) => ({
                              ...prev,
                              size: [...prev.size, {size: sz, stock: 0}],
                            }));
                          } else {
                            setAddProduct((prev) => ({
                              ...prev,
                              size: prev.size.filter((s) => s.size !== sz),
                            }));
                          }
                        }}
                      />
                      <span>{sz.toUpperCase()}</span>
                    </div>

                    <div>
                      <TextField
                        type="number"
                        label="stock"
                        size="small"
                        required
                        disabled={!existing}
                        value={existing?.stock ?? ""}
                        onChange={(e) => {
                          const newStock = Number(e.target.value);
                          setAddProduct((prev) => ({
                            ...prev,
                            size: prev.size.map((item) =>
                              item.size === sz
                                ? {...item, stock: newStock}
                                : item
                            ),
                          }));
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {selectField.map((item, index) => (
            <FormControl key={index}>
              <InputLabel>{item.key}</InputLabel>
              <Select<string>
                name={item.key}
                label={item.label}
                value={addProduct[item.key] as string}
                onChange={handleSelect}
                required
              >
                {item.value?.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
          <Button type="submit" variant="contained">
            add
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default AddProducts;
