import { auth } from "@/auth";
import HomePage from "./page.client";
import { siteConfig } from "@/lib/config";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin || false;

  // If homepage is disabled, redirect to appropriate location
  if (!siteConfig.enableHomepage) {
    if (session) {
      // Redirect to admin dashboard if user is admin
      if (isAdmin) {
        redirect("/admin");
      }
      // Otherwise, redirect to sign-in page
    } else {
      redirect("/api/auth/signin");
    }
  }

  return <HomePage session={session} isAdmin={isAdmin} />;
}
