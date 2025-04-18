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

    const body = await req.json();
    const { content } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Get the user from Clerk
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: session.userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: user.id,
        shortsId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[SHORTS_COMMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        shortsId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[SHORTS_COMMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 