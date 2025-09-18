"use client"

import { useEffect, useState } from "react"
import Hero from "@/components/Hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { HomePageSkeleton } from "@/components/skeletons/HomePageSkeleton"

export default function HomePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // No need to simulate loading for static content
    setLoading(false);
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  
  if (loading) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Section */}
      <Hero />
      {/* Section Divider 3 */}
      <div className="relative py-8 bg-[#18181b]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#bfc1c6]/40 to-transparent"></div>
        </div>
      </div>

      {/* Features */}
      <section className="py-16">
        <div className="container flex justify-center px-4 mx-auto">
          <div className="grid w-full max-w-xl grid-cols-1 gap-8 md:grid-cols-2">
            {[
              { icon: Truck, title: t('free_shipping'), subtitle: t('free_shipping_desc') },
              { icon: RotateCcw, title: t('easy_returns'), subtitle: t('easy_returns_desc') },
            ].map((feature, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="flex justify-center">
                  <feature.icon className="w-8 h-8 text-[#bfc1c6]" />
                </div>
                <h3 className="text-lg font-light text-[#e5e7eb] tracking-wide">{feature.title}</h3>
                <p className="text-[#bfc1c6] text-sm font-light">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
           {/* Section Divider 2 */}
      <div className="mb-22 relative py-8 bg-[#18181b]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#bfc1c6]/40 to-transparent"></div>
        </div>
      </div>

    </div>
  )
}
