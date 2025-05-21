import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md card p-8 border border-slate-800">
        <div className="text-center mb-12">          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <FileText
                size={32}
                className="text-green-500"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{siteConfig.siteName}</span>
          </h1>
          <p className="text-slate-400 mt-2">Sign in with Discord to continue</p>
        </div>          <Link 
          href="/api/auth/signin/discord" 
          className="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white py-4 px-6 rounded-md hover:bg-[#4752c4] transition-all duration-300 transform hover:scale-105"
        >
          <FaDiscord size={24} />
          <span className="font-medium text-lg">Sign in with Discord</span>
        </Link>
        
        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-800 pt-6">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
        <div className="mt-8 text-center">
        <Link href="/" className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
