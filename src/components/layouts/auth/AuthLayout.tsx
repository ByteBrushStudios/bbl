import { ReactNode } from "react";
import { FileText } from "lucide-react";
import { siteConfig } from "@/lib/config";

type AuthLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    icon?: ReactNode;
};

export default function AuthLayout({
    children,
    title = siteConfig.siteName,
    subtitle = "Sign in to continue",
    icon = <FileText size={32} className="text-green-500" />
}: AuthLayoutProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
            <div className="w-full max-w-md p-8 border card border-slate-800">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20">
                            {icon}
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold">
                        <span className="gradient-text">{title}</span>
                    </h1>
                    <p className="mt-2 text-slate-400">{subtitle}</p>
                </div>

                {children}
            </div>
        </div>
    );
}
