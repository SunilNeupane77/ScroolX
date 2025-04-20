import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params; // Resolve the Promise
    const { id } = params;

    if (!id) {
      return new NextResponse("Short ID is required", { status: 400 });
    }

    // Find the short
    const short = await prisma.shorts.findUnique({
      where: { id },
      select: { id: true, views: true },
    });

    if (!short) {
      return new NextResponse("Short not found", { status: 404 });
    }

    // Increment views count
    const updatedShort = await prisma.shorts.update({
      where: { id },
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