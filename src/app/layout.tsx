import { Inter } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { SessionProvider } from '@/components/SessionProvider';
import { ToastProvider } from '@/components/ui/Toast';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import './globals.css';

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export async function generateMetadata() {
  return {
    title: 'ByteBrush Links',
    description: 'Short link redirection service by ByteBrush Studios',
    icons: {
      icon: '/favicon.ico'
    }
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased bg-[#0c1120]`}
      >
        <SessionProvider>
          <SettingsProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                {children}
              </div>
            </ToastProvider>
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
