import dynamic from 'next/dynamic';
import { BarLoader } from "react-spinners";

const Chats = dynamic(() => import('@/components/chat/chats'), {
  ssr: false,
})

export default async function Page() {
  return (
    <main className="flex flex-col justify-center items-center mt-10">
      <Chats />
    </main>
  )
}