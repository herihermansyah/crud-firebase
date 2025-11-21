"use client";
import {db} from "@/lib/firebaseConfig";
import {Button} from "@mui/material";
import {collection, getDocs} from "firebase/firestore";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {ProductsWithId} from "../../types/products.types";
import ButtonBack from "@/components/ui/ButtonBack";
import Loading from "@/components/ui/Loading";
import {MdProductionQuantityLimits} from "react-icons/md";
import Image from "next/image";
import {imageAllowed} from "@/hook/imageAllowed";
import {motion} from "motion/react";

function ListProducts() {
  const [products, setProducts] = useState<ProductsWithId[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productSnapshot = await getDocs(collection(db, "products"));
        const productsList = productSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as ProductsWithId)
        );
        setProducts(productsList);
      } catch {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <span>gagal fetching data</span>
          </div>
        );
      }
    };
    fetchData();
  }, []);

  if (products.length === 0) {
    return (
      <div className="container mx-auto">
        <ButtonBack />
        <div className="mt-20 border border-gray-300 p-40 rounded-2xl">
          <div className="flex justify-center mb-5">
            <Button
              onClick={() => router.push("/addproducts")}
              variant="contained"
              color="success"
            >
              add products
            </Button>
          </div>
          <div className="flex items-center capitalize text-xl text-gray-500 justify-center gap-4">
            <span>tidak ada data products</span>
            <span>
              <MdProductionQuantityLimits />
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!products) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-2">
      <ButtonBack />
      <motion.div
        initial={{scale: 0, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.1}}
        className="border border-gray-300 p-5 rounded-2xl shadow-xl mt-10"
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => router.push("/addproducts")}
        >
          add products
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 mt-5">
          {products.map((item, index) => (
            <div
              className="flex flex-col gap-4 border border-gray-300 p-4 rounded-2xl shadow-md"
              key={index}
            >
              <span className="uppercase font-bold">no : {index + 1}</span>
              <div className="flex justify-center">
                <Image
                  src={
                    imageAllowed(item.thumbnail || "")
                      ? item.thumbnail!
                      : "/product.png"
                  }
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-50 h-50 rounded-md object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 capitalize">
                <span className="uppercase overflow-hidden whitespace-nowrap">
                  id : {item.id}
                </span>
                <span className="line-clamp-1">title : {item.title}</span>
                <span>Rp : {item.price.toLocaleString("id-ID")}</span>
              </div>

              <Button
                variant="contained"
                onClick={() =>
                  router.push(`/products/previewproduct/${item.id}`)
                }
              >
                view
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ListProducts;
