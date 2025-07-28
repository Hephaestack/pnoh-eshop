"use client"


import "../i18n/i18n";
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import LoadingIndicator from "@/components/LoadingIndicator"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import TopHeader from "@/components/top-header"

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <LoadingIndicator />}
      <TopHeader />
      <Header />
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}>{children}</main>
      <Footer />
    </>
  );
}
 
