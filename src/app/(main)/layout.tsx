import Header from "@/components/static/Header";
import Footer from "@/components/static/Footer";
import { getServerSession } from "next-auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();
    const isAdmin = session?.user?.isAdmin || false;

    return (
        <div className="relative flex flex-col min-h-screen">
            <Header isAdmin={isAdmin} session={session} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}