import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "./cart-context";

export const metadata = {
  title: "Πνοή - Jewelry E-Shop",
  description: "Εργαστήρι Χειροποίητου Κοσμήματος",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="el">
        <body className="min-h-screen bg-[#18181b]">
          <CartProvider>
            <ClientLayout>{children}</ClientLayout>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
