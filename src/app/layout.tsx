import Providers from "@/components/Providers"
import "./globals.css"

import { Inter, Playfair_Display } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable} 
          ${playfair.variable}
          min-h-screen
          bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}