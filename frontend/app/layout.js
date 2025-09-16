import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";
import CartProviderWrapper from "@/components/CartProviderWrapper";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Pnoh - Handmade Jewelry & Accessories",
    template: "%s | Pnoh - Handmade Jewelry",
  },
  description:
    "Pnoh - Handmade, artisanal jewelry crafted with care. Unique necklaces, rings, bracelets and earrings. Shop handmade jewelry in Greek and English.",
  keywords: [
    "handmade jewelry",
    "artisan jewelry",
    "χειροποίητα κοσμήματα",
    "necklaces",
    "rings",
    "earrings",
    "bracelets",
    "handmade",
  ].join(", "),
  applicationName: "Pnoh E-Shop",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      el: "/",
    },
  },
  openGraph: {
    title: "Pnoh - Handmade Jewelry & Accessories",
    description:
      "Unique, handmade jewelry. Necklaces, rings, bracelets and earrings crafted in Greece.",
    url: "/",
    siteName: "Pnoh",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Pnoh - Handmade Jewelry",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pnoh - Handmade Jewelry",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl={undefined}
      signUpFallbackRedirectUrl={undefined}
      signInForceRedirectUrl={undefined}
      signUpForceRedirectUrl={undefined}
    >
      <html lang="el" data-scroll-behavior="smooth">
        <head>
          {/* Use the site logo as the canonical favicon. Removed the duplicate /favicon.ico to avoid conflicts. */}
          <link rel="icon" href="/logo.webp" type="image/webp" />
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
