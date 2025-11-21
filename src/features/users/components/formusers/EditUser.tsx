"use client";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Users, UsersWithId} from "../../types/users.types";
import {useParams, useRouter} from "next/navigation";
import {db} from "@/lib/firebaseConfig";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {initialUsers} from "../../constants/initialUsers";
import {addresField, field, selectField} from "../../constants/fieldUsers";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import ButtonBack from "@/components/ui/ButtonBack";
import {motion} from "motion/react";
import {toast} from "react-toastify";

function EditUser() {
  const [userID, setUserID] = useState<UsersWithId>(() => ({
    ...initialUsers,
    id: "",
  }));
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const {id} = useParams();
  const router = useRouter();

  // fetch data by id

  useEffect(() => {
    const fetchDataId = async () => {
      try {
        const docRef = doc(db, "users", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserID({id: docSnap.id, ...(docSnap.data() as Users)});
        } else {
          console.log("Data tidak ditemukan");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    if (id) fetchDataId();
  }, [id]);

  // handle change input

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    if (name.includes(".")) {
      const [objectKey, objectValue] = name.split(".");
      // daftar object yang punya nested field
      const nestedKeys = ["address"] as const;
      if (nestedKeys.includes(objectKey as (typeof nestedKeys)[number])) {
        setUserID((prev) => ({
          ...prev,
          [objectKey]: {
            ...(prev[objectKey as keyof typeof prev] as Record<string, string>),
            [objectValue]: value,
          },
        }));
      }
    } else {
      setUserID((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // handle select input
  const handleSelect = (e: SelectChangeEvent<string | number>) => {
    const {name, value} = e.target;
    setUserID((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //! if you want upload file to firebase storage :: use this code

  //  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && ["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
  //     setImageFile(file);
  //   } else {
  //     alert("Hanya file PNG, JPG, atau WEBP yang diizinkan!");
  //   }
  // };

  // const handleEditUser = async (e: FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     let imageUrl = "";

  //     // upload gambar dulu ke storage kalau ada
  //     if (imageFile) {
  //       const fileRef = ref(storage, `user_images/${imageFile.name}-${Date.now()}`);
  //       await uploadBytes(fileRef, imageFile);
  //       imageUrl = await getDownloadURL(fileRef);
  //     }

  //     // save data to Firestore + link foto
  //     await addDoc(collection(db, "users"), {
  //       ...userID,
  //       photoUrl: imageUrl, // tambahkan field baru
  //     });

  //     alert("Data berhasil ditambahkan ✅");
  //     setUserID(initialUsers);
  //     setImageFile(null);
  // toast.success(`${userID.id} user berhasil di update`);
  //     router.push("/listusers");
  //   } catch {
  // toast.error(`${userID.id} user gagal di update`);
  //   }
  // };

  // handle edit data

  const handleEditUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!userID) return;
      const {id: userDocId, ...updatedData} = userID;
      await updateDoc(doc(db, "users", userDocId), updatedData);
      toast.success(`${userID.id} user berhasil di update`);
      router.push("/listusers");
    } catch {
      toast.error(`${userID.id} user gagal di update`);
      router.push("/listusers");
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-10">
      <ButtonBack />
      <motion.div
        initial={{scale: 1.2, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.2}}
        className="border border-gray-300 rounded-2xl p-5 shadow-xl"
      >
        <h3 className="uppercase  font-bold text-center mb-5">edit user</h3>
        <motion.form
          initial={{opacity: 1, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.3, duration: 0.2}}
          onSubmit={handleEditUser}
          className="flex flex-col gap-4"
        >
          {/* input data */}
          {field.map((item, index) => (
            <TextField
              key={index}
              fullWidth
              name={item.key}
              label={item.label}
              type={item.type}
              value={userID?.[item.key] ?? ""}
              onChange={handleChange}
              size="small"
              required
            />
          ))}

          {/* select data */}
          {selectField.map((item, index) => (
            <FormControl key={index} fullWidth size="small" required>
              <InputLabel>{item.key}</InputLabel>
              <Select<string | number>
                name={item.key}
                value={userID[item.key] as string | number}
                label="Gender"
                onChange={handleSelect}
              >
                {item.value?.map((v, i) => (
                  <MenuItem key={i} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}

          <div className="flex flex-col gap-2">
            <span className="text-[13px] capitalize text-red-600">
              optional image url
            </span>
            {/* input from url */}
            <TextField
              name="image"
              label="image url"
              onChange={handleChange}
              value={userID.image ?? ""}
              size="small"
            />
            {/* input from file */}

            {/* <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          /> */}
          </div>

          {/* input address data */}

          {addresField.map((item, index) => (
            <TextField
              key={index}
              fullWidth
              name={`address.${item.key}`}
              label={item.label}
              type={item.type}
              value={userID?.address[item.key] ?? ""}
              onChange={handleChange}
              size="small"
              required
            />
          ))}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="mt-4"
          >
            Edit User
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default EditUser;
