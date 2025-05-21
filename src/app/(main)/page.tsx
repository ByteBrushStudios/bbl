import { getServerSession } from "next-auth";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import OpenSourceCallout from "@/components/sections/OpenSourceCallout";

export default async function HomePage() {
  const session = await getServerSession();
  const isAdmin = session?.user?.isAdmin || false;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection isAdmin={isAdmin} />
        <FeaturesSection />
        <HowItWorksSection />
        <OpenSourceCallout />
      </main>
    </div>
  );
}
