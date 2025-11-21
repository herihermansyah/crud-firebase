"use client";
import {IconButton} from "@mui/material";
import {useRouter} from "next/navigation";
import React from "react";
import {IoMdArrowBack} from "react-icons/io";

function ButtonBack() {
  const router = useRouter();
  return (
    <div className="flex items-center">
      <IconButton size="small" onClick={() => router.back()}>
        <IoMdArrowBack />
        Back
      </IconButton>
    </div>
  );
}

export default ButtonBack;
