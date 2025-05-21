import { getServerSession } from "next-auth";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import Header from "@/components/static/Header";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import OpenSourceCallout from "@/components/sections/OpenSourceCallout";
import Footer from "@/components/static/Footer";

export default async function HomePage() {
  // Get session using NextAuth v4 method
  const session = await getServerSession();
  const isAdmin = session?.user?.isAdmin || false;

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin={isAdmin} session={session} />

      <main className="flex-1">
        <HeroSection isAdmin={isAdmin} />
        <FeaturesSection />
        <HowItWorksSection />
        <OpenSourceCallout />
      </main>

      <Footer />
    </div>
  );
}
