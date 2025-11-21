"use client";
import React, {useEffect, useState} from "react";
import {UsersWithId} from "../../types/users.types";
import {collection, getDocs} from "firebase/firestore";
import {db} from "@/lib/firebaseConfig";
import {useRouter} from "next/navigation";
import {Button} from "@mui/material";
import ButtonBack from "@/components/ui/ButtonBack";
import {FaUserSlash} from "react-icons/fa";
import {motion} from "motion/react";
import Image from "next/image";
import Loading from "@/components/ui/Loading";
import {imageAllowed} from "@/hook/imageAllowed";

function ListUsers() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UsersWithId[]>([]);
  const router = useRouter();

  // fetch data / list user data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userSnapshots = await getDocs(collection(db, "users"));
        const userList = userSnapshots.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as UsersWithId)
        );
        setUser(userList);
      } catch {
        return (
          <div>
            <p>error fetch data</p>
          </div>
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!loading && user.length === 0) {
    return (
      <div className="container mx-auto">
        <ButtonBack />
        <div className="mt-20 border border-gray-300 p-40 rounded-2xl">
          <div className="flex justify-center mb-5">
            <Button
              onClick={() => router.push("/addusers")}
              variant="contained"
              color="success"
            >
              add user
            </Button>
          </div>
          <div className="flex items-center capitalize text-xl text-gray-500 justify-center gap-4">
            <span>tidak ada data users</span>
            <span>
              <FaUserSlash />
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto flex flex-col gap-10 px-2">
      <ButtonBack />
      <div className="flex flex-col gap-5 border border-gray-300 p-5 rounded-2xl shadow-xl">
        <div>
          <Button
            onClick={() => router.push("/addusers")}
            variant="contained"
            color="success"
          >
            add user
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {user?.map((item, index) => (
            <motion.div
              initial={{opacity: 0, scale: 0}}
              animate={{opacity: 1, scale: 1}}
              key={index}
              className="flex flex-col gap-4 border border-gray-300 p-4 rounded-2xl shadow-md"
            >
              <span className="capitalize">no : {index + 1}</span>
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row items-start gap-4">
                <Image
                  src={
                    imageAllowed(item.image || "") ? item.image! : "/user.png"
                  }
                  alt={item.firstName}
                  width={200}
                  height={200}
                  className="w-50 h-50 rounded-md"
                />
                <div className="flex flex-col gap-2 capitalize">
                  <span className="uppercase whitespace-nowrap ">
                    ID : {item.id}
                  </span>
                  <span>first name : {item.firstName}</span>
                  <span>last name : {item.lastName}</span>
                  <span>
                    full name : {item.firstName} {item.lastName}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/users/previewuser/${item.id}`)}
                variant="contained"
                size="small"
              >
                view
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListUsers;
