'use client';

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { signIn } from "next-auth/react";
import ErrorLayout from "@/components/layouts/error/ErrorLayout";

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
                return "Access was previously denied. We've updated our system to allow all Discord users to sign in. Please try signing in again.";
            case "CredentialsSignin":
                return "Invalid credentials.";
            default:
                return "An unknown error occurred during authentication.";
        }
    };

    return (
        <ErrorLayout
            icon={<AlertCircle size={32} className="text-red-500" />}
            title="Authentication Error"
            description={getErrorMessage()}
            iconColor="text-red-500"
        >
            <div className="flex flex-col gap-4 mt-6">
                <button
                    onClick={() => signIn('discord')}
                    className="w-full flex items-center justify-center gap-2 bg-[#5865F2] text-white py-3 px-4 rounded-md hover:bg-[#4752c4] transition-colors"
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>

                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-3 px-4 rounded-md hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
            </div>
        </ErrorLayout>
    );
}
