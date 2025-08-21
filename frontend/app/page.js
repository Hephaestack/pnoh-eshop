"use client"

import { useEffect } from "react"
import Hero from "@/components/Hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export default function HomePage() {
  const { t } = useTranslation();
  
  // Signal page ready immediately for home page
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  
  return (
    <div className="bg-[#18181b] min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Collections - Minimal Redesign */}
      <section className="py-20 bg-[#23232a]">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">{t('featured_collections')}</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: 'Ethnic', image: '/images/test2.jpg' },
              { title: 'Minimal', image: '/images/test2.jpg' },
              { title: 'Luxury', image: '/images/test2.jpg' },
              { title: 'One of a kind', image: '/images/test2.jpg' },
            ].map((collection, idx) => (
              <div
                key={collection.title}
                className="group flex flex-col items-center justify-center bg-[#18181b] border border-[#23232a] rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden hover:border-[#bfc1c6] hover:shadow-[0_4px_24px_0_#bfc1c655] hover:bg-[#202024]"
                style={{ minHeight: 320 }}
              >
                <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-[#23232a] rounded-t-xl overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#23232a]/10 transition-all duration-300 pointer-events-none rounded-t-xl"></div>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
                  <h3 className="text-lg font-normal text-[#e5e7eb] tracking-wide mb-1 uppercase letter-spacing-[0.1em]">{collection.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-[#18181b]">
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            <div className="flex flex-col items-center space-y-6 lg:items-start">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb]">{t('jewelry_art_title')}</h2>
              <div className="w-16 h-px bg-[#bfc1c6]"></div>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                {t('jewelry_art_desc1')}
              </p>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                {t('jewelry_art_desc2')}
              </p>
            </div>
            <div className="relative w-full h-[420px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[700px] flex items-stretch justify-center lg:justify-end">
              <Image
                src="/images/test2.jpg"
                alt="Jewelry crafting"
                fill
                sizes="(max-width: 1024px) 100vw, 700px"  
                className="object-cover object-center w-full h-full grayscale-[30%] rounded-xl shadow-xl"
                priority
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#bfc1c6] rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#23232a] border-t-2 border-[#bfc1c6]">
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
    </div>
  )
}
