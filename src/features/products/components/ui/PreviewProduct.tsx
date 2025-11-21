"use client";
import React, {useEffect, useState} from "react";
import {Products, ProductsWithId} from "../../types/products.types";
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {db} from "@/lib/firebaseConfig";
import {useParams, useRouter} from "next/navigation";
import ButtonBack from "@/components/ui/ButtonBack";
import {Button} from "@mui/material";
import Image from "next/image";
import {imageAllowed} from "@/hook/imageAllowed";
import Loading from "@/components/ui/Loading";
import {motion} from "motion/react";
import {toast} from "react-toastify";

function PreviewProduct() {
  const [productID, setProductID] = useState<ProductsWithId | null>(null);
  const {id} = useParams();
  const router = useRouter();

  // fetching data
  useEffect(() => {
    const fetchDataId = async () => {
      try {
        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProductID({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Products, "id">),
          });
        }
      } catch {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <span>gagal fetching data</span>
          </div>
        );
      }
    };
    if (id) fetchDataId();
  }, [id]);

  // handle delete product
  const handleDelete = async () => {
    const conf = confirm("are you sure?");
    if (!conf) return toast.error("gagal delete product");
    try {
      await deleteDoc(doc(db, "products", id as string));
      setProductID(null);
      toast.success("berhasil delete product");
      router.push("/products");
    } catch {
      toast.error("gagal delete product");
    }
  };

  // loading fetching data
  if (!productID) {
    return <Loading />;
  }

  // discount
  const nilaiDiscount = (productID?.price * productID?.discount) / 100;
  const hargaDiscount = productID?.price - nilaiDiscount;

  // total stock
  const totalStock = productID.size.reduce(
    (sum, item) => sum + Number(item.stock),
    0
  );
  // total harga
  const totalHarga = productID.price * totalStock;

  return (
    <div className="container mx-auto px-2">
      <ButtonBack />
      <div className="flex flex-col gap-4 p-5 border border-gray-300 rounded-2xl shadow-2xl mt-10">
        <div className="flex flex-col 2xl:flex-row gap-10">
          <motion.div
            initial={{translateX: -500, opacity: 0}}
            animate={{translateX: 0, opacity: 1}}
            transition={{duration: 0.3}}
          >
            <Image
              src={
                imageAllowed(productID?.thumbnail ?? "")
                  ? productID?.thumbnail ?? "/product.png"
                  : "/product.png"
              }
              alt={productID?.title || ""}
              width={400}
              height={400}
              className="rounded-3xl w-[1000px] h-[500px]  object-cover"
            />
          </motion.div>
          <div className="flex flex-wrap gap-5 capitalize">
            <motion.div
              initial={{translateX: 500, opacity: 0, scale: 0}}
              animate={{translateX: 0, opacity: 1, scale: 1}}
              transition={{delay: 0.3, duration: 0.3}}
              className="flex flex-col gap-1 capitalize border shadow-xl border-gray-300 rounded-lg p-5"
            >
              <span>id : {productID?.id}</span>
              <span>title : {productID?.title}</span>
              <span>
                price : Rp, {productID?.price.toLocaleString("id-ID")}
              </span>
            </motion.div>
            <motion.div
              initial={{translateX: 500, opacity: 0, scale: 0}}
              animate={{translateX: 0, opacity: 1, scale: 1}}
              transition={{delay: 0.6, duration: 0.3}}
              className="flex flex-col gap-1 capitalize border shadow-xl border-gray-300 rounded-lg p-5"
            >
              <span>discount persen : {productID?.discount}%</span>
              <span>
                {" "}
                nilai discount : Rp, {nilaiDiscount.toLocaleString(
                  "id-ID"
                )}{" "}
              </span>
              <span>
                harga akhir : Rp, {hargaDiscount.toLocaleString("id-ID")}
              </span>
            </motion.div>
            <motion.div
              initial={{translateX: 500, opacity: 0, scale: 0}}
              animate={{translateX: 0, opacity: 1, scale: 1}}
              transition={{delay: 0.9, duration: 0.3}}
              className="flex flex-col gap-1 capitalize border shadow-xl border-gray-300 rounded-lg p-5 "
            >
              <span>description : {productID?.description}</span>
              <span>category : {productID?.category}</span>
              <span>rating : {productID?.rating}</span>
              <span>target : {productID?.target}</span>
            </motion.div>
            <motion.div
              initial={{translateX: 500, opacity: 0, scale: 0}}
              animate={{translateX: 0, opacity: 1, scale: 1}}
              transition={{delay: 1.2, duration: 0.3}}
              className="border shadow-xl border-gray-300 rounded-lg p-5"
            >
              <div className="flex flex-col w-full gap-1">
                {productID?.size.map((s, i) => (
                  <div key={i}>
                    {/* smartphone */}
                    <div className="flex lg:hidden">
                      <div className="w-[30px]">
                        <span className="uppercase">{s.size}</span>
                      </div>
                      <div className="w-[150px] flex gap-2">
                        <span>:</span>
                        <span>
                          {Number(s.stock).toLocaleString("id-ID")} pcs{" "}
                        </span>
                      </div>
                    </div>
                    {/* desktop */}
                    <div className="hidden lg:flex items-center">
                      <div className="w-[30px]">
                        <span className="uppercase">{s.size}</span>
                      </div>
                      <div className="w-[150px] flex gap-2">
                        <span>:</span>
                        <span>
                          {Number(s.stock).toLocaleString("id-ID")} pcs{" "}
                        </span>
                      </div>
                      <div className="w-[250px] flex gap-4">
                        <span className="lowercase">x</span>
                        <span>
                          Rp,{productID.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div className="w-[400px] flex gap-4">
                        <span>=</span>
                        <span>
                          Rp,{" "}
                          {(productID.price * s.stock).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <span className="w-full border border-gray-300" />
                <span>
                  total stock : {totalStock.toLocaleString("id-ID")} pcs
                </span>
                <span>
                  harga satuan : Rp, {productID.price.toLocaleString("id-ID")}
                </span>
                <span>
                  total harga = Rp, {totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{translateY: -500, scale: 0, opacity: 0}}
          animate={{translateY: 0, scale: 1, opacity: 1}}
          transition={{delay: 1.5, duration: 0.3}}
          className="flex gap-5"
        >
          <Button variant="contained" color="error" onClick={handleDelete}>
            delete product
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              router.push(`/products/editproduct/${productID?.id}`)
            }
          >
            edit product
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default PreviewProduct;
