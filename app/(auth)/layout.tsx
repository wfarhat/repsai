import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css';
export const metadata = {
    title: 'RepsAI',
    description: 'Next.js Site for workout generation'
}

const inter = Inter({ subsets: ["latin"] })
export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-dark-1 `}>
                    <div className="center-container">
                        {children}

                    </div>
                </body>

            </html>
        </ClerkProvider >

    )
}