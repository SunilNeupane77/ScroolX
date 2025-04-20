import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    id: string;
  };
};

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const { id } = params;

    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the short
    const short = await prisma.shorts.findUnique({
      where: { id },
      select: { id: true, likes: true },
    });

    if (!short) {
      return new NextResponse("Short not found", { status: 404 });
    }

    // Increment likes count
    const updatedShort = await prisma.shorts.update({
      where: { id },
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
