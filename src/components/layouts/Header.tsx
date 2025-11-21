import Link from "next/link";
import React from "react";
import {RiHome3Fill} from "react-icons/ri";

function Header() {
  return (
    <div className="bg-red-600">
      <div>
        <Link href="/" className="flex items-center justify-center gap-2">
          <span>
            <RiHome3Fill size={30} color="white" />
          </span>
          <h1 className="uppercase font-bold p-2 text-2xl text-white">
            crud firebase
          </h1>
        </Link>
      </div>
    </div>
  );
}

export default Header;
