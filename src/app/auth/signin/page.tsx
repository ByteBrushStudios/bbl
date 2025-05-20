import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{siteConfig.siteName}</h1>
          <p className="text-slate-600 dark:text-slate-400">Sign in with Discord to continue</p>
        </div>
        
        <Link 
          href="/api/auth/signin/discord" 
          className="w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white py-3 px-4 rounded-md hover:bg-[#4752c4] transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4C14.85 4.3 14.68 4.66 14.56 4.95C12.98 4.7 11.41 4.7 9.88 4.95C9.76 4.66 9.58 4.3 9.42 4C7.92 4.26 6.48 4.71 5.14 5.33C2.31 9.56 1.62 13.7 2 17.77C3.78 19.11 5.53 19.9 7.25 20.43C7.7 19.81 8.09 19.16 8.42 18.47C7.73 18.22 7.08 17.9 6.47 17.53C6.59 17.44 6.71 17.35 6.83 17.26C10.03 18.76 13.48 18.76 16.65 17.26C16.77 17.35 16.89 17.44 17 17.53C16.39 17.9 15.74 18.22 15.05 18.47C15.38 19.16 15.77 19.81 16.22 20.43C17.94 19.9 19.7 19.11 21.48 17.77C21.92 13.07 20.83 8.97 19.27 5.33ZM8.57 15.13C7.5 15.13 6.59 14.14 6.59 12.94C6.59 11.73 7.47 10.74 8.57 10.74C9.66 10.74 10.57 11.73 10.54 12.94C10.55 14.14 9.66 15.13 8.57 15.13ZM15.43 15.13C14.36 15.13 13.45 14.14 13.45 12.94C13.45 11.73 14.33 10.74 15.43 10.74C16.52 10.74 17.43 11.73 17.4 12.94C17.4 14.14 16.52 15.13 15.43 15.13Z" fill="currentColor"/>
          </svg>
          Sign in with Discord
        </Link>
        
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
