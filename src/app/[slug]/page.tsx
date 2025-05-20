import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  
  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link) {
    return {
      title: "Link Not Found",
      description: "The requested link does not exist.",
    };
  }
  
  if (link.metadata) {
    const meta = link.metadata as Record<string, string>;
    return {
      title: meta.title || "ByteBrush Links",
      description: meta.description || "A redirecting link",
      openGraph: {
        title: meta.title || "ByteBrush Links",
        description: meta.description || "A redirecting link",
        images: meta.image ? [{ url: meta.image }] : undefined,
      },
    };
  }

  return {
    title: "ByteBrush Links - Redirecting",
    description: "You are being redirected to the destination URL.",
  };
}

export default async function RedirectPage({ params }: PageProps) {
  const { slug } = params;
  
  const link = await prisma.link.findUnique({
    where: { slug },
  });

  if (!link || !link.active) {
    notFound();
  }

  // Update visit count
  await prisma.link.update({
    where: { id: link.id },
    data: { visits: { increment: 1 } },
  });

  redirect(link.targetUrl);
}
