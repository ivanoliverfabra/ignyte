'use client'

import { useEffect, useState } from "react"
import { useToast } from "./ui/use-toast"
import { ToastAction, ToastActionElement } from "./ui/toast"
import { useSession } from "next-auth/react"
import { useChannel } from "ably/react";
import { User } from "@/lib/types"
import { Toaster } from "./ui/toaster"
import Link from "next/link"

export function Notifications() {
  const [toastId, setToastId] = useState<string>('')
  const { toast } = useToast()
  const { data, status } = useSession()
  const user = data && data.user ? data.user as User : null 

  const { channel, ably } = useChannel(user ? `${user.id}-notifications` : 'noauth', (message) => {
    if (message.clientId === ably.auth.clientId) return
    if (message.name === "new-chat") {
      const { id, title, creator } = message.data
      sendToast(undefined, `${creator} invited you to ${title}`, <ToastAction altText="join" asChild><Link href={`/chat/${id}`}>Join</Link></ToastAction>)
    } else if (message.name === "new-message") {
      const { id, title, creator } = message.data
      sendToast(undefined, `${creator} sent a message in ${title}`, <ToastAction altText="view" asChild><Link href={`/chat/${id}`}>View</Link></ToastAction>)
    }
  });

  function sendToast(title?: string, description?: string, action?: ToastActionElement) {
    const newToast = toast({
      title,
      description,
      action,
    })
    setToastId(newToast.id)
  }

  return (
    <Toaster />
  )
}