"use client"
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation"; 

import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); 

  return (
    <html lang="en">
      <body className={inter.className}>
          <ClerkProvider>
            <Topbar />

            <main className="flex flex-row">
              <LeftSidebar />
              <section className="main-container">
                <div className="w-full max-w-4xl">{children}</div>
              </section>

              {pathname === "/saved-workout" && <RightSidebar />}
            </main>

            <Bottombar />
          </ClerkProvider>
      </body>
    </html>

  );
}
