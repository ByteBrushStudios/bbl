import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const linkSchema = z.object({
  slug: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/),
  targetUrl: z.string().url(),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().url().optional(),
    })
    .optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const links = await prisma.link.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { message: "Error fetching links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = linkSchema.parse(body);

    // Check if slug already exists
    const existingLink = await prisma.link.findUnique({
      where: {
        slug: validatedData.slug,
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { message: "A link with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the link
    const link = await prisma.link.create({
      data: {
        slug: validatedData.slug,
        targetUrl: validatedData.targetUrl,
        metadata: validatedData.metadata || undefined,
        createdBy: session.user.id,
        active: true,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error creating link" },
      { status: 500 }
    );
  }
}
