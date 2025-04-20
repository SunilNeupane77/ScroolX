import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Define the expected shape of the request body
interface CommentBody {
  content: string;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get session from Clerk
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json() as CommentBody;
    const { content } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    // Get the user from Prisma
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
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
  } catch (error: unknown) {
    console.error("[SHORTS_COMMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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
  } catch (error: unknown) {
    console.error("[SHORTS_COMMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}