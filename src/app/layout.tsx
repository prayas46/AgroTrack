
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import AppSidebar from "@/components/app-sidebar";
import { LanguageProvider } from "@/context/language-context";
import { AuthSessionProvider } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "AgroTrack",
  description: "Autonomous Climate-Adaptive Agriculture Planner & Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <AuthSessionProvider>
          <FirebaseClientProvider>
            <LanguageProvider>
              <div className="relative flex min-h-screen w-full flex-col">
                <AppSidebar />
                <main className="flex-1">
                  <div className="container max-w-7xl p-4 sm:p-6 lg:p-8">
                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
            </LanguageProvider>
          </FirebaseClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
