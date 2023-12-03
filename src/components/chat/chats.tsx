"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "../ui/button";
import Link from "next/link";
import { Chat, User } from "@/lib/types";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "../ui/avatar";
import { NewChat } from "./newchat";
import { Items } from "../ui/combobox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "../ui/use-toast";
import { redirect } from "next/navigation";
import { client } from "@/lib/ably";

export default function Chats() {
  const { toast } = useToast()

  const { data, status } = useSession()
  if (!data || !data.user) redirect("/")
  const session = data.user as User
  const [chats, setChats] = useState<Chat[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Items>([{ label: session.name as string, value: session.id}])
  const [title, setTitle] = useState("")
  const [removeChatId, setRemoveChatId] = useState("")

  function handleOpen(id: string) {
    setRemoveChatId(id)
    setIsOpen(true)
  }

  async function deleteChat() {
    if (!removeChatId) return toast({
      title: "Error",
      description: "Something went wrong",
    })
    try {
      await fetch("/api/chats", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ removeChatId })
      }).then((res) => res.json())
      toast({
        title: `Chat ${chats.find((chat) => chat.id === removeChatId)?.name} deleted`,
        description: "We've permanently deleted this chat and all of its data.",
      })
      setChats(chats.filter(chat => chat.id !== removeChatId))
    } catch (error) {
      console.error(error)
    }
    setIsOpen(false)
  }

  useEffect(() => {
    async function getMessages() {
      if (!session) return
      try {
        const data = await fetch("https://fabra.tech/api/chats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "userId": session.id
          }
        }).then(res => res.json())
        setChats(data)
      } catch (error) {
        setChats([])
      }
    }

    if (status === "authenticated") {
      getMessages()
    }
  }, [session, status])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const users = selectedUsers.map(user => user.value)
    const data = { title, users }

    const channels = users.map(u => `${u}-notifications`)

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      }).then((res) => res.json())

      channels.forEach(c => {
        const channel = client.channels.get(c)
        if (channel) {
          channel.publish('new-chat', {
            id: res.id,
            title: res.name,
            creator: session.name,
            creatorId: session.id,
          })
        }
      })

      setChats([...chats, res])
      setTitle("")
      setSelectedUsers([])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {chats.map((chat, i) => (
        <Button key={i} size="sm" variant="outline" className="h-32 w-full relative">
          {chat.creatorId === session?.id && (
            <Button size='icon' className="z-10 h-6 w-6 absolute top-0 right-0 rounded-tl-none rounded-br-none" variant="destructive" onClick={() => handleOpen(chat.id)}>
              <X />
            </Button>
          )}
          <Link href={`/chat/${chat.id}`} className="w-32 h-32 flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <AvatarGroup limit={4}>
                {chat.users && chat.users.map((user) => (
                  <Avatar key={user.id}>
                    <AvatarImage src={user.image || `https://i2.wp.com/ui-avatars.com/api/${user.name}/128/random?ssl=1`} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
            </div>
            {chat.name}
          </Link>
        </Button>
      ))}
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete <span>{chats.find(c => c.id === removeChatId)?.name || 'this chat'} </span>
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteChat}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NewChat onSubmit={handleSubmit} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} setTitle={setTitle} title={title} />
    </div>
  )
}