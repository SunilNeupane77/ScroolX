import ShortsCard from "@/components/shorts/short-card";
import { db } from "@/lib/db";

interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  const results = await db.shorts.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for &quot;{query}&quot;
      </h1>
      
      {results.length === 0 ? (
        <p className="text-muted-foreground">No results found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((short) => (
            <ShortsCard key={short.id} short={short} />
          ))}
        </div>
      )}
    </div>
  );
}