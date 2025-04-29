import ShortsCard from "@/components/shorts/short-card";
import { db } from "@/lib/db";
import { type NextPage } from "next";

// Define the correct PageProps interface for Next.js 15.2.2
interface PageProps {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Use NextPage to ensure proper typing for the page component
const SearchPage: NextPage<PageProps> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams; // Resolve the Promise
  const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : ""; // Safely extract q as a string

  const results = await db.shorts.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for &quot;{q.replace(/[<>]/g, "")}&quot;
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
};

export default SearchPage;