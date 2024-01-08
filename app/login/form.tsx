"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import Link from "next/link";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!response?.error) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center w-screen bg-gray2">
        <div className="my-5">Login</div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 mt-[300px] items-center"
      >
        <input
          name="email"
          className="border bg-gray border-white text-white placeholder-white w-[300px] pl-2"
          type="email"
          placeholder="Email"
        />
        <input
          name="password"
          className="border bg-gray border-white text-white placeholder-white w-[300px] pl-2"
          type="password"
          placeholder="Password"
        />
        <button
          className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
          type="submit"
        >
          Login
        </button>
        <div>Don't have an account?</div>
        <Link
          className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
          href="/register"
        >
          Register
        </Link>
      </form>
    </div>
  );
}
