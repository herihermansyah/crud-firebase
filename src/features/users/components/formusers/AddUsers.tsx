"use client";
import React, {ChangeEvent, FormEvent, useState} from "react";
import {addDoc, collection} from "firebase/firestore";
import {db} from "@/lib/firebaseConfig";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import {addresField, field, selectField} from "../../constants/fieldUsers";
import {initialUsers} from "../../constants/initialUsers";
import {useRouter} from "next/navigation";
import {Users} from "../../types/users.types";
import ButtonBack from "@/components/ui/ButtonBack";
import {motion} from "motion/react";
import {toast} from "react-toastify";

function AddUsers() {
  const [addUser, setAddUser] = useState<Users>(initialUsers);
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  // handle change input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    if (name.includes(".")) {
      const [objectKey, objectValue] = name.split(".");
      // nested object
      const nestedKeys = ["address"] as const;
      if (nestedKeys.includes(objectKey as (typeof nestedKeys)[number])) {
        setAddUser((prev) => ({
          ...prev,
          [objectKey]: {
            ...(prev[objectKey as keyof typeof prev] as Record<string, string>),
            [objectValue]: value,
          },
        }));
      }
    } else {
      setAddUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // handle select input
  const handleSelect = (e: SelectChangeEvent<string | number>) => {
    const {name, value} = e.target;
    setAddUser((prev) => ({
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

  // const handleAddUser = async (e: FormEvent) => {
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
  //       ...addUser,
  //       photoUrl: imageUrl, // tambahkan field baru
  //     });

  //     alert("Data berhasil ditambahkan ✅");
  //     setAddUser(initialUsers);
  //     setImageFile(null);
  //     toast.success("data berhasil ditambah");
  //     router.push("/listusers");
  //   } catch  {
  // toast.error("data gagal ditambah");
  //   }
  // };

  // handle submit form
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "users"), addUser);
      setAddUser(initialUsers);
      toast.success("data berhasil ditambah");
      router.push("/listusers");
    } catch {
      toast.error("data gagal ditambah");
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
        <h3 className="uppercase  font-bold text-center mb-5">add user</h3>
        <motion.form
          initial={{opacity: 1, scale: 0}}
          animate={{opacity: 1, scale: 1}}
          transition={{delay: 0.3, duration: 0.2}}
          onSubmit={handleAddUser}
          className="flex flex-col gap-4"
        >
          {/* input data  */}
          {field.map((item, index) => (
            <TextField
              key={index}
              fullWidth
              name={item.key}
              label={item.label}
              type={item.type}
              value={addUser[item.key] ?? ""}
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
                value={addUser[item.key] as string | number}
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

          {/* image input / image select file */}
          <div className="flex flex-col gap-2">
            <span className="text-[13px] capitalize text-red-600">
              optional image url
            </span>
            {/* input from url */}
            <TextField
              name="image"
              label="image url"
              onChange={handleChange}
              value={addUser.image ?? ""}
              size="small"
            />
            {/* input from file */}

            {/* <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          /> */}
          </div>

          {/* inut data address */}
          {addresField.map((item, index) => (
            <TextField
              key={index}
              fullWidth
              name={`address.${item.key}`}
              label={item.label}
              type={item.type}
              value={addUser.address[item.key] ?? ""}
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
            add User
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default AddUsers;
