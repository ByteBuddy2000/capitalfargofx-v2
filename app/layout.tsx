// app/layout.tsx
import type { Metadata } from "next"
import "@/app/globals.css"
import Tawk from "@/components/tawk/Tawk"
import SessionWrapper from "@/components/SessionWrapper/SessionWrapper"

export const metadata: Metadata = {
  title: "CapitalsFargoFX",
  description: "Digital asset management and investment platform.",
  icons: {
    icon: "/favicon.png",
  },
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <SessionWrapper>
          {children}
        </SessionWrapper>
        {/* <Tawk /> */}
      </body>
    </html>
  )
}