"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "./store/useEmail";

type Chat = {
  email: string;
};

export default function Chats() {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();
  const { setEmail } = useStore();

  const fetchChats = async () => {
    const response = await fetch(`/api/user_conversations`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      },
    });

    const data = await response.json();
    setChats(data.emails);
  };

  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  const handleActiveChat = async (chat: Chat) => {
    setEmail(chat.email);
    router.push("/conversation");
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center w-screen bg-gray2">
        <div className="my-5">Chats</div>
      </div>
      {!session && <div>Login to see your chats</div>}
      {chats?.map((chat, index) => (
        <div className="flex flex-col gap-5 items-center" key={index}>
          <div>{chat.email}</div>
          <button
            className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
            onClick={() => handleActiveChat(chat)}
          >
            Active Chat
          </button>
        </div>
      ))}
    </div>
  );
}
