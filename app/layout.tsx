import { Geist } from "next/font/google";
import './globals.css';
import { cn } from "@/lib/utils";
import { BottomNav, Sidebar, Header } from '@/components/layout/Navigation';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { PageTransition } from '@/components/layout/PageTransition';
import { TelegramPopup } from '@/components/layout/TelegramPopup';
import { SecurityProvider } from '@/components/layout/SecurityProvider';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: 'Sachin Academy',
  description: 'Premium Educational Platform by Sachin Academy',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <SecurityProvider>
            <div className="min-h-screen bg-gray-50 md:pl-64 pb-14 md:pb-0 pt-14 md:pt-0">
              <Sidebar />
              <Header />
              <main className="max-w-7xl mx-auto">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <BottomNav />
              <TelegramPopup />
              <Toaster position="top-center" richColors />
            </div>
          </SecurityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
