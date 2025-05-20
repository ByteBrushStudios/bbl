import Link from "next/link";

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
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-slate-600 dark:text-slate-400">{getErrorMessage()}</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-6">
          <Link 
            href="/auth/signin" 
            className="w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/" 
            className="w-full text-center bg-slate-200 dark:bg-slate-800 py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
