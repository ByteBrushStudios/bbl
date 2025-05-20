import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const linkUpdateSchema = z.object({
  slug: z.string().min(1).regex(/^[a-zA-Z0-9-_]+$/).optional(),
  targetUrl: z.string().url().optional(),
  metadata: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().url().optional(),
    })
    .optional(),
  active: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { message: "Error fetching link" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if link exists
    const existingLink = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLink) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = linkUpdateSchema.parse(body);

    // If slug is changed, check if new slug already exists
    if (validatedData.slug && validatedData.slug !== existingLink.slug) {
      const slugExists = await prisma.link.findUnique({
        where: {
          slug: validatedData.slug,
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: "A link with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Update the link
    const link = await prisma.link.update({
      where: {
        id: params.id,
      },
      data: {
        slug: validatedData.slug,
        targetUrl: validatedData.targetUrl,
        metadata: validatedData.metadata,
        active: validatedData.active,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating link:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error updating link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if link exists
    const existingLink = await prisma.link.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLink) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    // Delete the link
    await prisma.link.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { message: "Error deleting link" },
      { status: 500 }
    );
  }
}
