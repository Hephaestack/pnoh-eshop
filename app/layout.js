
import "./globals.css"
import ClientLayout from "@/components/ClientLayout"
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: "Πνοή - Jewelry E-Shop",
  description: "Εργαστήρι Χειροποίητου Κοσμήματος",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="el">
        <body className="min-h-screen bg-[#18181b]">
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
