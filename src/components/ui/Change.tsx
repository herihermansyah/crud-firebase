"use client";
import {collection, getDocs} from "firebase/firestore";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {FaUser} from "react-icons/fa";
import {FaBoxOpen} from "react-icons/fa6";
import {db} from "@/lib/firebaseConfig";
import {AnimatePresence, motion} from "motion/react";

function Change() {
  const [user, setUser] = useState(0);
  const [product, setProduct] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnap = await getDocs(collection(db, "users"));
        const productSnap = await getDocs(collection(db, "products"));
        setUser(userSnap.size);
        setProduct(productSnap.size);
      } catch {}
      setMounted(true);
    };
    fetchData();
  }, []);
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-50 gap-10 md:gap-20">
      <AnimatePresence>
        {mounted && (
          <>
            <Link href="/users">
              <motion.div
                initial={{scale: 0, translateX: -500}}
                animate={{scale: 1, translateX: 0}}
                whileHover={{scale: 1.2}}
                transition={{duration: 0.1}}
                className="flex items-center gap-4 border border-gray-500 p-10 md:p-20 rounded-2xl shadow-xl
            text-gray-500"
              >
                <span>
                  <FaUser size={70} />
                </span>
                <span className="text-4xl font-bold">: {user}</span>
              </motion.div>
            </Link>

            <Link href="/products">
              <motion.div
                initial={{scale: 0, translateX: 500}}
                animate={{scale: 1, translateX: 0}}
                whileHover={{scale: 1.2}}
                transition={{duration: 0.1}}
                className="flex items-center gap-4 border border-gray-500 p-10 md:p-20 rounded-2xl shadow-xl
            text-gray-500"
              >
                <span>
                  <FaBoxOpen size={70} />
                </span>
                <span className="text-4xl font-bold">: {product}</span>
              </motion.div>
            </Link>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Change;
