"use client";
import {deleteDoc, doc, getDoc} from "firebase/firestore";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {Users, UsersWithId} from "../../types/users.types";
import {db} from "@/lib/firebaseConfig";
import {Button} from "@mui/material";
import Image from "next/image";
import ButtonBack from "@/components/ui/ButtonBack";
import Loading from "@/components/ui/Loading";
import {motion} from "motion/react";
import {toast} from "react-toastify";
import {imageAllowed} from "@/hook/imageAllowed";

function Preview() {
  const [userID, setUserID] = useState<UsersWithId | null>(null);
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
  const router = useRouter();

  // fetch data by id

  useEffect(() => {
    const fetchDataId = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "users", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserID({id: docSnap.id, ...(docSnap.data() as Omit<Users, "id">)});
        } else {
          return (
            <div>
              <p>error fetch data</p>
            </div>
          );
        }
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
    if (id) fetchDataId();
  }, [id]);

  // image allowed
  const img = userID?.image ?? ""; // is undefined → ""
  const finalImage = imageAllowed(img) ? img : "/user.png";

  // handle delete data user
  const handleDelete = async () => {
    const conf = confirm("are you sure?");
    if (!conf) {
      toast.error(
        `${userID?.firstName.toUpperCase()} ${userID?.lastName.toUpperCase()} gagal di hapus `
      );
      return;
    }

    try {
      await deleteDoc(doc(db, "users", id as string));
      setUserID(null);
      toast.success(
        `${userID?.firstName.toUpperCase()} ${userID?.lastName.toUpperCase()} berhasil hapus `
      );
      router.push("/listusers");
    } catch {
      toast.error(
        `${userID?.firstName.toUpperCase()} ${userID?.lastName.toUpperCase()} gagal di hapus `
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto flex flex-col gap-10 px-2">
      <ButtonBack />
      <motion.div
        initial={{scale: 0, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.1}}
        className="border border-gray-300 p-5  rounded-2xl shadow-xl"
      >
        <div className="flex flex-col gap-4  capitalize">
          <div className="flex flex-col md:flex-row gap-5">
            <Image
              src={finalImage}
              alt={userID?.firstName || "image"}
              width={400}
              height={400}
              className="rounded-xl w-[400px] h-[400px]"
            />
            <div className="flex flex-col gap-4">
              <span className="uppercase">id : {userID?.id}</span>
              <span>first name : {userID?.firstName}</span>
              <span>last name : {userID?.lastName}</span>
              <span>
                full name : {userID?.firstName} {userID?.lastName}{" "}
              </span>
              <span>phone : +{userID?.phone}</span>
              <span>email : {userID?.email}</span>
            </div>
          </div>
          <hr className="text-gray-300" />
          <h3>info</h3>
          <div className="flex flex-col gap-5 ml-5">
            <span>username : {userID?.username}</span>
            <span>password : {userID?.password}</span>
            <span>role : {userID?.role}</span>
            <span>gender : {userID?.gender}</span>
            <span>birth date : {userID?.birthDate}</span>
          </div>
          <hr className="text-gray-300" />
          <h3>address</h3>
          <div className="flex flex-col gap-5 ml-5">
            <span>address : {userID?.address.address}</span>
            <span>city : {userID?.address.city}</span>
            <span>state : {userID?.address.state}</span>
            <span>country : {userID?.address.country}</span>
          </div>
          <hr className="text-gray-300" />
          <div className="flex gap-4">
            <Button
              onClick={() => router.push(`/users/edituser/${userID?.id}`)}
              size="small"
              color="secondary"
              variant="contained"
            >
              edit user
            </Button>
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="error"
              size="small"
            >
              delete user
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Preview;
