import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const short = await prisma.shorts.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        views: true,
      },
    });

    if (!short) {
      return new NextResponse("Short not found", { status: 404 });
    }

    // Increment views count
    const updatedShort = await prisma.shorts.update({
      where: {
        id: params.id,
      },
      data: {
        views: short.views + 1,
      },
    });

    return NextResponse.json(updatedShort);
  } catch (error) {
    console.error("[SHORTS_VIEW]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 