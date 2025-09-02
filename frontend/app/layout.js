import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";
import CartProviderWrapper from "@/components/CartProviderWrapper";

export const metadata = {
  title: "Πνοή - Jewelry E-Shop",
  description: "Εργαστήρι Χειροποίητου Κοσμήματος",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="el" data-scroll-behavior="smooth">
        <head>
          {/* Optimize font loading */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* Add display=swap to prevent FOIT */}
          <style dangerouslySetInnerHTML={{ 
            __html: `
              @font-face {
                font-display: swap;
              }
            `
          }} />
        </head>
        <body className="min-h-screen bg-[#18181b]">
          {/* Clerk Smart CAPTCHA container - required for clerk-captcha initialization */}
          <div id="clerk-captcha" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" />
          <CartProviderWrapper>
            <ClientLayout>{children}</ClientLayout>
          </CartProviderWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
