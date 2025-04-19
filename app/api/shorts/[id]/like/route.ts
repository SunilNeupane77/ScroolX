import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const short = await prisma.shorts.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        likes: true,
      },
    });

    if (!short) {
      return new NextResponse("Short not found", { status: 404 });
    }

    // Increment likes count
    const updatedShort = await prisma.shorts.update({
      where: {
        id: params.id,
      },
      data: {
        likes: short.likes + 1,
      },
    });

    return NextResponse.json(updatedShort);
  } catch (error) {
    console.error("[SHORTS_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 