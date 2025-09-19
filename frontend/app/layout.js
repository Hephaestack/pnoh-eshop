import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ClerkProvider } from "@clerk/nextjs";
import CartProviderWrapper from "@/components/CartProviderWrapper";

export const metadata = {
  // Use an environment-provided origin in production; fall back to localhost for dev
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Πνοή - Χειροποίητα Κοσμήματα & Αξεσουάρ",
    template: "%s | Πνοή - Χειροποίητα Κοσμήματα",
  },
  description:
    "Πνοή - Χειροποίητα, καλλιτεχνικά κοσμήματα φτιαγμένα με μεράκι. Μοναδικά κολιέ, δαχτυλίδια, βραχιόλια και σκουλαρίκια.",
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
  applicationName: "Πνοή E-Shop",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      el: "/",
    },
  },
  openGraph: {
    title: "Πνοή - Χειροποίητα Κοσμήματα & Αξεσουάρ",
    description:
      "Μοναδικά, χειροποίητα κοσμήματα. Κολιέ, δαχτυλίδια, βραχιόλια και σκουλαρίκια φτιαγμένα στην Ελλάδα.",
    url: "/",
    siteName: "Πνοή",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
    alt: "Pnoh - Χειροποίητα Κοσμήματα",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pnoh - Χειροποίητα Κοσμήματα",
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
          {/* Use the site logo as the canonical favicon and for PWA */}
          {/* Add a simple cache-busting query so browsers refetch rather than reuse a cached Vercel icon */}
          <link rel="icon" href="/logo.webp?v=2" type="image/webp" />
          <link rel="shortcut icon" href="/logo.webp?v=2" />
          <link rel="apple-touch-icon" href="/logo.webp?v=2" />
          <link rel="manifest" href="/manifest.json" />
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
