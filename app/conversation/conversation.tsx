"use client";

import { FormEvent, useEffect, useState } from "react";
import { useStore } from "../store/useEmail";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";

type Message = {
  email: string;
  message_text: string;
  message_id: number;
  created_on: string;
};

type Conversation = {
  created_on: string;
};

export default function Conversation() {
  const { data: session } = useSession();
  const { email } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const emailWithoutDomain = email.includes("@")
    ? email.substring(0, email.indexOf("@"))
    : email;
  const router = useRouter();

  const pusher = new Pusher("76cdfe6a239fad68b82a", {
    cluster: "ap2",
  });

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email]);

  const addMessages = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/messages`, {
      method: "POST",
      body: JSON.stringify({
        message: formData.get("message"),
        contactEmail: email,
      }),
    });
    if (document.body.contains(form)) {
      form.reset();
    }
    fetchMessages();
  };

  const deleteMessages = async (message_id: number) => {
    const response = await fetch(`/api/messages`, {
      method: "DELETE",
      body: JSON.stringify({
        message_id,
      }),
    });
    fetchMessages();
  };

  const fetchMessages = async () => {
    const response = await fetch(
      `/api/messages?contactEmail=${encodeURIComponent(email)}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    setMessages(data.messages);
    setConversation({
      created_on: data.conversationCreatedOn,
    });
  };

  useEffect(() => {
    if (session) {
      fetchMessages();
    }

    var channel = pusher.subscribe("my-channel");

    channel.bind("my-event", function () {
      fetchMessages();
    });
  }, [session]);

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="fixed top-0 flex flex-col items-center w-screen bg-gray2">
        <div className="my-5">Chatting with {emailWithoutDomain}</div>
      </div>
      {conversation && (
        <div className="mt-[80px]">
          Chat started on{" "}
          {new Date(conversation.created_on).toLocaleDateString() +
            " " +
            new Date(conversation.created_on).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
        </div>
      )}
      <div className="flex flex-col w-screen xl:w-[1200px] gap-5">
        {messages?.map((message, index) => (
          <div
            className={`flex flex-col ${
              message.email === session?.user?.email
                ? "items-end mx-5"
                : "items-start mx-5"
            }`}
            key={index}
          >
            <div
              className={`rounded-lg ${
                message.email === session?.user?.email ? "bg-green" : "bg-gray2"
              }`}
            >
              <div className={"mt-1 mx-2 break-all"}>
                {!email.includes("@") &&
                  message.email !== session?.user?.email && (
                    <div>{message.email.split("@")[0]}</div>
                  )}
                {message.message_text}
                {message.email === session?.user?.email && (
                  <button
                    className="ml-2"
                    onClick={() => deleteMessages(message.message_id)}
                  >
                    ❌
                  </button>
                )}
              </div>
              <div className="text-xs mb-1 mx-2 flex flex-col items-end ml-[150px]">
                {new Date(message.created_on).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 flex flex-col items-center w-screen bg-gray2">
        <form
          className="flex w-screen xl:w-[1200px] items-center"
          onSubmit={addMessages}
        >
          <input
            name="message"
            className="bg-gray text-white placeholder-white w-full h-[30px] my-5 ml-5 pl-2"
            placeholder="Message"
          />
          {session && (
            <button
              className="w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
              type="submit"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
