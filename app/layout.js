
import "./globals.css"
import ClientLayout from "@/components/ClientLayout"

export const metadata = {
  title: "Πνοή - Jewelry E-Shop",
  description: "Εκλεπτυσμένα κοσμήματα που συνδυάζουν παράδοση και σύγχρονο design",
}

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="min-h-screen bg-[#18181b]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
