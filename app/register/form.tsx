"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (data.message === "Email cannot be empty") {
      alert("Email cannot be empty");
    } else if (data.message === "Password cannot be empty") {
      alert("Email already exists");
    } else if (data.message === "Email already exists") {
      alert("Email already exists");
    } else if (data.message === "Success") {
      alert("Registration successful");
    } else {
      alert("An error occurred");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center w-screen bg-gray2">
        <div className="my-5">Register</div>
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
          Register
        </button>
        <div>Already have an account?</div>
        <Link
          className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
          href="/login"
        >
          Login
        </Link>
      </form>
    </div>
  );
}
