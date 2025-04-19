// app/page.tsx
import ShortCard from '@/components/shorts/short-card';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export default async function Home() {
  const user = await currentUser();

  let loggedInUser = null;

  if (user) {
    loggedInUser = await prisma.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (!loggedInUser) {
      loggedInUser = await prisma.user.create({
        data: {
          name: user.fullName || 'Name',
          email: user.emailAddresses[0].emailAddress,
          clerkUserId: user.id,
        },
      });
    }
  }

  const shorts = await prisma.shorts.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory animate-fade-in">
      <div className="flex flex-col items-center animate-slide-up">
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="snap-start flex justify-center items-center h-screen animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ShortCard short={short} />
          </div>
        ))}
      </div>
    </div>
  );
}
