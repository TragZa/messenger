"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <button
      className="rounded-lg w-[250px] h-[30px] flex flex-col items-center justify-center hover:bg-green2 hover:text-black active:bg-green3"
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </button>
  );
}
