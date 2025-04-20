import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the params Promise
    const params = await context.params;

    // Get session from Clerk
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the short
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
  } catch (error: unknown) {
    console.error("[SHORTS_LIKE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}