"use client"

import { links } from "@/lib/nav";
import { User } from "@/lib/types";
import { CornerDownLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createRef, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
}

export function Aside({ isOpen }: Props) {
  const pathName = usePathname();
  const { data } = useSession() 
  const user = data && data.user ? data.user as User : null

  const [indicatorStyle, setIndicatorStyle] = useState({
    transform: 'translateY(0) translateX(20px)',
    opacity: 0
  });

  const refs = links.map((link) => {
    return {
      url: link.url,
      current: createRef<HTMLAnchorElement>()
    };
  });

  useEffect(() => {
    const activeRef = refs.find((ref) => pathName === `/u/${user?.name}` ? ref.url === "/u" : ref.url === pathName)?.current.current;

    if (activeRef) {
      const { offsetTop, offsetHeight } = activeRef;
      setIndicatorStyle({
        transform: `translateY(${offsetTop - 18}px) translateX(-14px)`,
        opacity: 1
      });
    } else {
      setIndicatorStyle({
        transform: 'translateX(0) translateX(-14px)',
        opacity: 0
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen pt-14 transition-transform border-r-2 border-separate bg-muted${isOpen ? ' w-52' : ' -translate-x-[65%] w-44'}`}>
      <div className="relative">
        <ul className={`flex flex-col justify-start gap-2 p-4${isOpen ? ' items-start' : ' items-end'}`}>
          {links.map(({ label, url, icon }, i) => (
            <li key={i}>
              <Link
                ref={refs[i].current}
                className={`text-md transition-colors flex gap-x-2 ${pathName === url ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                href={url === "/u" && user ? `/u/${user.id}` : url}
              >
                {icon}
                {isOpen && label}
              </Link>
            </li>
          ))}
          <div
            className={`absolute right-0 transition-all duration-300 h-7 w-7 rounded-md pointer-events-none${isOpen ? '' : ' bg-red-500/25'}`}
            style={ indicatorStyle }
          ><CornerDownLeft opacity={isOpen ? 1 : 0} /></div>
        </ul>
      </div>
    </aside>
  )
}