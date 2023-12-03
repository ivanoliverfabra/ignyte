'use client'

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { User } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { BarLoader } from 'react-spinners';

interface Props {
  user: User;
}

export function ActionButtons({ user }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [data, setData] = useState<{ user: User } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/auth/session`);
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    }

    fetchUser();
  }, [])

  useEffect(() => {
    if (!data || !data.user || !user) return;
    const currentUser = data.user as User;

    const isFollowing = currentUser.following?.some((following) => following.followingId === user.id);

    if (isFollowing) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [data, user]);

  async function followUser() {
    if (!data || !data.user || !user) return;
    try {
      setIsFollowingLoading(true)

      await fetch(`/api/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ followingId: user.id, followerId: data.user.id })
      })
      
      setIsFollowing(!isFollowing)
      setIsFollowingLoading(false)
    } catch (error) {
      console.log(error);
      setIsFollowingLoading(false)
    }
  }

  async function messageUser() {
    if (!data || !data.user || !user) return;
    
    
  }

  return (
    <div className="flex items-center justify-center gap-x-2">
      {isLoading ? (
        <>
          <Skeleton className="w-20 h-9" />
          <Skeleton className="w-20 h-9" />
          <Skeleton className="w-20 h-9" />
        </>
      ) : (
        user.id === data?.user?.id ? (
          <Button>Settings</Button>
        ) : (
          <>
            <Button onClick={followUser} disabled={isFollowingLoading}>
              {isFollowingLoading ? (
                <BarLoader className='text-foreground' width={48} />
              ) : (
                isFollowing ? 'Unfollow' : 'Follow'
              )}
            </Button>
            <Button onClick={messageUser} disabled={isMessageLoading}>
            {isMessageLoading ? (
                <BarLoader className='text-foreground' width={48} />
              ) : 'Message'}
            </Button>
            <Button>Report</Button>
          </>
        )
      )}
    </div>
  );
}