import React from "react";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-4 ">
      <span>loading</span>
      <AiOutlineLoading3Quarters className="animate-spin " />
    </div>
  );
}

export default Loading;
