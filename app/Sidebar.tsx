"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Logout from "./logout";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 1800) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [windowWidth]);

  const email = session?.user?.email;
  const emailWithoutDomain = email?.substring(0, email.indexOf("@"));

  return (
    <div>
      <div
        className={`fixed top-0 bg-gray2 w-[300px] h-screen flex flex-col gap-5 items-center ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="mt-[65px]">messenger App</div>
        {!!session && (
          <>
            <div>{emailWithoutDomain}</div>
          </>
        )}
        <Link
          className={`rounded-lg w-[250px] h-[30px] flex flex-col items-center justify-center ${
            pathname === "/chats"
              ? "bg-green"
              : "hover:bg-green2 hover:text-black active:bg-green3"
          }`}
          href="/"
        >
          Chats
        </Link>
        <Link
          className={`rounded-lg w-[250px] h-[30px] flex flex-col items-center justify-center ${
            pathname === "/contacts"
              ? "bg-green"
              : "hover:bg-green2 hover:text-black active:bg-green3"
          }`}
          href="/contacts"
        >
          Contacts
        </Link>
        {!!session && <Logout />}
        {!session && (
          <Link
            className={`rounded-lg w-[250px] h-[30px] flex flex-col items-center justify-center ${
              pathname === "/login"
                ? "bg-green"
                : "hover:bg-green2 hover:text-black active:bg-green3"
            }`}
            href="/login"
          >
            Login
          </Link>
        )}
      </div>
      <div
        className={`fixed bottom-0 bg-gray2 w-[300px] h-[300px] flex flex-col gap-5 justify-end items-center z-10 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div>Developed by</div>
        <div className="flex gap-2 mb-5">TragZa</div>
      </div>
      <button
        className="fixed top-0 mt-5 ml-5 text-lg z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "⬅️" : "➡️"}{" "}
      </button>
    </div>
  );
}
