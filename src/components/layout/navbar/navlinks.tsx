'use client';

import { createRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react"
import { User } from '@/lib/types';
import { links } from '@/lib/nav';

export function NavLinks({ user }:{ user: any }) {
  const pathName = usePathname();
  const { data } = useSession() as { data: { user: User } | null }
  const offset = 10;
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: 'translateX(0)',
    opacity: 0
  });
  const refs = links.map((link) => {
    return {
      url: link.url,
      current: createRef<HTMLAnchorElement>()
    };
  });

  useEffect(() => {
    const activeRef = refs.find((ref) => pathName === `/u/${user?.user?.name}` ? ref.url === "/u" : ref.url === pathName)?.current.current;

    if (activeRef) {
      const { offsetWidth: width, offsetLeft: left } = activeRef;
      setIndicatorStyle({
        width: width + offset,
        transform: `translateX(${left - offset / 2}px)`,
        opacity: 1
      });
    } else {
      setIndicatorStyle({
        width: 0,
        transform: 'translateX(0)',
        opacity: 0
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <div className="relative items-center justify-start gap-x-4 col-span-2 hidden md:flex">
      {links.map(({ label, url }, i) => (
        <Link
          className={`text-sm transition-colors ${pathName === url ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
          ref={refs[i].current}
          key={i}
          href={url === "/u" && data && data.user ? `/u/${data.user.id}` : url}
        >
          {label}
        </Link>
      ))}
      <div
        className='absolute bottom-0 transition-all duration-300 h-[2px] bg-white'
        style={ indicatorStyle }
      />
    </div>
  );
}