import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata = {
  title: "Πνοή - Jewelry E-Shop",
  description: "Εκλεπτυσμένα κοσμήματα που συνδυάζουν παράδοση και σύγχρονο design",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="min-h-screen bg-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
