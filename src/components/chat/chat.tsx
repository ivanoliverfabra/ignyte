/* eslint-disable @next/next/no-img-element */
'use client'

import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChannel } from "ably/react";
import { Button } from '../ui/button';
import { Chat, Message, User } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import { Input } from '../ui/input';
import { redirect } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { client } from '@/lib/ably';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  chat: Chat;
}

type ActiveUser = {
  id: string;
  name: string;
  image: string;
  typing?: boolean;
}

export default function Chat({ chat }: Props) {
  const { data, status } = useSession() as { data: { user: User } | null, status: 'loading' | 'unauthenticated' | 'authenticated' }
  const user = data ? data.user : null

  if (!user) redirect('/chat')

  const messagesEndRef = useRef(null)
  const inputBoxRef = useRef(null);

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);     
  const messageTextIsEmpty = messageText.trim().length === 0;

  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])

  const { channel, ably } = useChannel(chat.id, (message) => {
    const history = messages.slice(-199);
    setMessages([...history, message.data]);
    if (message.clientId === ably.auth.clientId) {
      fetch(`/api/chats/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: message.clientId,
          data: message.data.content,
        }),
      }).then((res) => res.json())
    }
  });

  const addUser = useCallback((user: ActiveUser) => {
    setActiveUsers((prev) => {
      const uniqueUsers = new Set([...prev, user]);
      return Array.from(uniqueUsers);
    });
  }, []);
  
  const removeUser = useCallback((user: ActiveUser) => {
    setActiveUsers((prev) => prev.filter((u) => u.id !== user.id));
  }, []);

  const updateUser = useCallback((user: ActiveUser) => {
    setActiveUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);
      const updatedUsers = [...prev];
      updatedUsers[index] = user;
      return updatedUsers;
    });
  }, []);

  useEffect(() => {
    channel.presence.enterClient(user.id, { id: user.id, name: user.name, image: user.image, typing: false });
  
    const handleEnter = (member: any) => {
      addUser(member.data);
    };
    channel.presence.subscribe('enter', handleEnter);
  
    const handleLeave = (member: any) => {
      removeUser(member.data);
    };
    channel.presence.subscribe('leave', handleLeave);

    const handleUpdate = (member: any) => {
      updateUser(member.data);
    }

    channel.presence.subscribe('update', handleUpdate);
  
    channel.presence.get().then((members: any) => {
      const users = members.map((member: any) => member.data);
      setActiveUsers(users);
    });
  
    return () => {
      channel.presence.leaveClient(user.id);
      channel.presence.unsubscribe('enter', handleEnter);
      channel.presence.unsubscribe('leave', handleLeave);
    };
  }, [channel, user.id, user.name, user.image, addUser, removeUser, updateUser]);  
  
  const sendChatMessage = useCallback((messageText: string) => {
    if (!chat || !chat.users) return
    const updateTyping = async (typing: boolean) => {
      return await channel.presence.update({ id: user.id, name: user.name, image: user.image, typing });
    }

    const filteredUsers = chat.users.filter(user => !activeUsers.find(u => u.id === user.id));
    console.log(filteredUsers)

    updateTyping(false);
    channel.publish({ name: "chat-message", data: {
      content: messageText,
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
      },
      createdAt: new Date().toISOString(),
    }});
    setMessageText("");
    // @ts-ignore
    if (inputBoxRef.current) inputBoxRef.current.focus();

    filteredUsers.forEach(u => {
      const c = client.channels.get(`${u.id}-notifications`)
      c.publish('new-message', { id: chat.id, title: chat.name, creator: user.name, creatorId: user.id })
    })
  }, [channel, user.id, user.name, user.image, chat, activeUsers]);
  
  
  const handleFormSubmission = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendChatMessage(messageText);
  }, [sendChatMessage, messageText]);

  useEffect(() => {
    async function fetchOldMessages() {
      try {
        const response = await fetch(`/api/chats/${chat.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch old messages");
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
    fetchOldMessages();
  }, [chat.id]);

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
  
    setMessageText(value);

    const updateTyping = async (typing: boolean) => {
      return await channel.presence.update({ id: user.id, name: user.name, image: user.image, typing });
    }

    if (value.length === 1) {
      updateTyping(true);
    } else if (value.length === 0) {
      updateTyping(false);
    }
  }, []);

  if (!user) return (
    <div className='flex justify-center items-center'>
      <p>Sign in to chat</p>
    </div>
  )

  const activeTypingUsers = activeUsers.filter((u) => u.typing && u.id !== user.id)
  const isUserActive = (userId: string) => {
    return activeUsers.find((u) => u.id === userId)
  }

  return (
    <div className='flex justify-center items-center gap-y-4 w-screen px-20'>
      {user && (
        <>
          <div>
            <div className='flex -translate-y-7'>
              {chat.users && chat.users.map((u) => (
                <Tooltip key={u.id}>
                  <TooltipTrigger>
                    <div className='flex justify-center items-center relative'>
                      <Avatar>
                        <AvatarImage src={u.image} alt={u.name} />
                        <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 border-2 border-background bg-green-500 w-4 h-4 rounded-full${isUserActive(u.id) ? ' opacity-100' : ' opacity-0'}`} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {u.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <ScrollArea className='flex flex-col gap-2 max-h-[50vh] md:max-h-[70vh] overflow-hidden w-[80vw]'>
              {messages && messages.length >= 1 && messages.map((message, index) => (
                <ChatMessage key={index} message={message} clientId={user.id} />
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className='flex flex-col absolute bottom-20'>
              <form className='flex justify-center items-center' onSubmit={handleFormSubmission}>
                <div className='flex relative w-[80vw]'>
                  <div className='flex relative w-full'>
                    <Label className='absolute -top-4'>
                      {
                        activeTypingUsers.length >= 1 ? (
                          activeTypingUsers.length < 3 ? (
                            activeTypingUsers.map((us, i) => (
                              <span key={us.id}>
                                {us.name}
                                {activeTypingUsers.length === i + 1 ? (activeTypingUsers.length > 1 ? ' are ' : ' is ') : ' and '}
                              </span>
                            ))
                          ) : (
                            <span>Multiple users </span>
                          )
                        ) : ''
                      }
                      {activeUsers.filter((u) => u.typing && u.id !== user.id).length >= 1 && 'typing...'}
                    </Label>
                    <Input
                      ref={inputBoxRef}
                      value={messageText}
                      placeholder="Type a message..."
                      className='rounded-r-none'
                      onChange={handleTyping}
                    />
                  </div>
                  <Button className='rounded-l-none' type="submit" disabled={messageTextIsEmpty}>
                    Send
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 


const ChatMessage = React.memo(({ message, clientId }:{ message: Message, clientId: string}) => {
  const isMe = message.user?.id === clientId;
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className='flex items-start mb-4 mx-4 px-4 py-0.5' key={message.id}>
      <img src={message.user?.image || ''} alt="Avatar" className="w-10 h-10 rounded-full translate-y-2" />
      <div className='px-2 rounded-md max-w-full shadow-md'>
        <div className="flex items-center justify-start gap-x-4">
          <Button variant='link' className='text-sm font-bold p-0'>
            <Link href={`/u/${message.user?.id}`}>
              {message.user?.name}
            </Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-gray-400">{time}</p>
            </TooltipTrigger>
            <TooltipContent className='bg-popover text-popover-foreground border border-muted'>
              {new Date(message.createdAt).toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm max-w-screen-xl break-all">{message.content}</p>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';