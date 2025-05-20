import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin || false;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
      <header className="p-4 bg-slate-100 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{siteConfig.siteName}</h1>
          <nav className="flex gap-4">
            {session ? (
              <>
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  href="/api/auth/signout" 
                  className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-col gap-8 items-center justify-center p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to {siteConfig.siteName}</h2>
          <p className="text-xl mb-8">
            Create and manage custom short links with support for Open Graph previews.
          </p>

          {isAdmin ? (
            <Link 
              href="/admin/links/create" 
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors text-lg font-medium"
            >
              Create a New Link
            </Link>
          ) : (
            <p className="text-lg">
              Sign in with Discord to manage your links.
            </p>
          )}
        </div>
      </main>

      <footer className="p-4 bg-slate-100 dark:bg-slate-900 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ByteBrush Studios | <a href={`mailto:${siteConfig.supportEmail}`} className="hover:underline">Contact</a> | <a href={siteConfig.discordServer} className="hover:underline" target="_blank" rel="noopener noreferrer">Discord</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
