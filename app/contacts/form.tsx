"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "../store/useEmail";

type Contact = {
  contact: string;
  contact_id: number;
};

export default function Form() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const { setEmail } = useStore();

  const fetchContacts = async () => {
    const response = await fetch(`/api/contacts`, {
      method: "GET",
    });
    const data = await response.json();
    setContacts(data.contacts);
  };

  useEffect(() => {
    if (session) {
      fetchContacts();
    }
  }, [session]);

  const addContacts = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await fetch(`/api/contacts`, {
      method: "POST",
      body: JSON.stringify({ contact: formData.get("contact") }),
    });
    const data = await response.json();
    if (data.message === "Contact already exists") {
      alert(data.message);
    } else if (data.message === "User does not exist") {
      alert(data.message);
    } else {
      fetchContacts();
    }
  };

  const deleteContacts = async (contact_id: number) => {
    const response = await fetch(`/api/contacts`, {
      method: "DELETE",
      body: JSON.stringify({
        contact_id,
      }),
    });
    fetchContacts();
  };

  const handleCheckboxChange = (contactEmail: string) => {
    if (selectedContacts.includes(contactEmail)) {
      setSelectedContacts(
        selectedContacts.filter((email) => email !== contactEmail)
      );
    } else {
      setSelectedContacts([...selectedContacts, contactEmail]);
    }
  };

  const handleChat = async (contact: string) => {
    const response = await fetch(`/api/handleChats`, {
      method: "POST",
      body: JSON.stringify({
        contactEmail: contact,
      }),
    });
    const data = await response.json();
    setEmail(contact);
    router.push("/conversation");
  };

  const createGroup = async () => {
    const response = await fetch(`/api/createGroup`, {
      method: "POST",
      body: JSON.stringify({
        groupName: groupName,
        contactEmails: selectedContacts,
      }),
    });
    const data = await response.json();
    if (data.message === "Group name cannot be empty") {
      alert("Group name cannot be empty");
    } else {
      setEmail(groupName);
      router.push("/conversation");
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center w-screen bg-gray2">
        <div className="my-5">Contacts</div>
      </div>
      {!isGroupChat && (
        <form
          className="flex flex-col gap-5 items-center"
          onSubmit={addContacts}
        >
          <input
            name="contact"
            className="border bg-gray border-white text-white placeholder-white w-[300px] pl-2"
            type="email"
            placeholder="Contact Email"
          />
          {session && (
            <button
              className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
              type="submit"
            >
              Add Contact
            </button>
          )}
        </form>
      )}
      {!session && <div>Login to add & see your contacts</div>}
      {session && (
        <button
          className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
          onClick={() => setIsGroupChat(!isGroupChat)}
        >
          Group Chat
        </button>
      )}
      {isGroupChat && (
        <div className="flex flex-col gap-5 items-center">
          <input
            className="border bg-gray border-white text-white placeholder-white w-[300px] pl-2"
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
            onClick={createGroup}
          >
            Create Group
          </button>
        </div>
      )}
      {contacts?.map((contact, index) => (
        <div className="flex flex-col gap-5 items-center" key={index}>
          <div className="ml-10">
            {contact.contact}
            {!isGroupChat && (
              <button
                className="ml-5"
                onClick={() => deleteContacts(contact.contact_id)}
              >
                ❌
              </button>
            )}
            {isGroupChat && (
              <input
                className="ml-5"
                type="checkbox"
                onChange={() => handleCheckboxChange(contact.contact)}
              />
            )}
          </div>
          {!isGroupChat && (
            <button
              className="rounded-lg w-[100px] h-[30px] flex flex-col items-center justify-center bg-green hover:bg-green2 hover:text-black active:bg-green3"
              onClick={() => handleChat(contact.contact)}
            >
              Chat
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
