import { ActionButtons } from '@/components/profile/ActionButtons';
import db from '@/lib/db'
import { User } from '@/lib/types';

interface Props {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: Props) {
  const userProfile = await db.user.findUnique({
    where: {
      id: params.slug
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    }
  }) as unknown as User

  return (
    <main className="flex flex-col items-center justify-between p-24">
      { userProfile ? (
        <div className="flex flex-col items-center justify-center gap-y-4">
          <h1 className="text-4xl font-bold">{userProfile.name}</h1>
          <h2 className="text-2xl font-semibold">{userProfile.email}</h2>
          <ActionButtons user={userProfile} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">User not found</h2>
        </div>
      )}
    </main>
  )
}