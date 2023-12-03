"use client"

import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Combobox, Items } from "../ui/combobox"
import { useEffect, useState } from "react"
import { User } from "@/lib/types"

interface Props {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedUsers: Items;
  setSelectedUsers: React.Dispatch<React.SetStateAction<Items>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NewChat({ title, setTitle, selectedUsers, setSelectedUsers, onSubmit }: Props) {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json()) as User[]
        setUsers(data)
      } catch (error) {
        console.log(error)
        setUsers([])
      }
    }

    getUsers()
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-32 w-32">
          <div className="flex flex-col justify-center items-center">
            <Plus size={32} />
            <p>New Chat</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={onSubmit} className="flex flex-col gap-y-4">
            <div>
              <Label>
                Chat Title
              </Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Name" />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label>
                Members
              </Label>
              <Combobox items={users.map((user) => {return { label: user.name as string, value: user.id as string }})} values={selectedUsers} setValues={setSelectedUsers} placeholder="Select users" />
            </div>

            <Button disabled={selectedUsers.length < 2 || title.length < 3}>
              Create {title || 'Chat'} with {selectedUsers.length} members
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}