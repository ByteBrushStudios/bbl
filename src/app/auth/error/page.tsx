import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { error } = searchParams;
  
  const getErrorMessage = () => {
    switch (error) {
      case "OAuthSignin":
        return "Error starting the OAuth signin process.";
      case "OAuthCallback":
        return "Error in the OAuth callback.";
      case "OAuthCreateAccount":
        return "Error creating OAuth account.";
      case "EmailCreateAccount":
        return "Error creating email account.";
      case "Callback":
        return "Error in the OAuth callback.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account.";
      case "AccessDenied":
        return "Access denied. You don't have permission to sign in.";
      case "CredentialsSignin":
        return "Invalid credentials.";
      default:
        return "An unknown error occurred during authentication.";
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#0c1120]">
      <div className="w-full max-w-md card p-8 border border-slate-800">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">
            Authentication Error
          </h1>
          <p className="text-slate-400">{getErrorMessage()}</p>
        </div>
          <div className="flex flex-col gap-4 mt-6">
          <Link 
            href="/api/auth/signin/discord" 
            className="w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white py-3 px-4 rounded-md hover:bg-[#4752c4] transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </Link>
          
          <Link 
            href="/" 
            className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 px-4 rounded-md hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          For assistance, contact us at <a href={`mailto:${siteConfig.supportEmail}`} className="text-green-400 hover:text-green-300">{siteConfig.supportEmail}</a>
        </p>
      </div>
    </div>
  );
}
