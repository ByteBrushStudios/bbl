import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">BBL Admin</h1>
        </div>
        
        <nav className="space-y-2">
          <Link 
            href="/admin" 
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            href="/admin/links" 
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Manage Links
          </Link>
          <Link 
            href="/admin/links/create" 
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Create Link
          </Link>
        </nav>
        
        <div className="mt-auto pt-6">
          <Link 
            href="/" 
            className="block px-4 py-2 text-sm rounded hover:bg-slate-800 transition-colors"
          >
            Back to Site
          </Link>
          <Link 
            href="/api/auth/signout" 
            className="block px-4 py-2 text-sm rounded hover:bg-slate-800 transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}
