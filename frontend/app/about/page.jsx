
"use client";
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Heart, Gem } from "lucide-react"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"


export default function AboutPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Signal page ready immediately for about page
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);

  return (
    <div className="bg-[#18181b] text-[#e5e7eb]">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-[#18181b] to-[#23232a] border-b border-[#23232a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-light tracking-wide text-[#e5e7eb] mb-4 goth-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {t('about_title')}
          </motion.h1>
          <motion.div 
            className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          ></motion.div>
          <motion.p 
            className="text-lg text-[#bfc1c6] font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            {t('about_intro')}
          </motion.p>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section 
        className="py-20 bg-[#18181b]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto">
          <div className="grid items-center justify-center grid-cols-1 gap-16 text-center lg:grid-cols-2 lg:text-left">
            <motion.div 
              className="flex flex-col items-center space-y-6 lg:items-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb]">{t('our_story_title')}</h2>
              <div className="w-16 h-px bg-[#bfc1c6]"></div>
              <p className="text-[#bfc1c6] leading-relaxed font-light">
                {t('our_story_text')}
              </p>
              <Button
                variant="outline"
                className="border-[#bfc1c6] text-[#bfc1c6] hover:bg-[#23232a] hover:text-white hover:border-white transition-all duration-300 bg-transparent"
              >
                {t('learn_more')}
              </Button>
            </motion.div>
            <motion.div 
              className="relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src="/images/pnoh9.jpeg"
                alt="Pnoi Shop"
                width={400}
                height={500}
                className="w-full h-150 object-cover grayscale-[30%]"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section 
        className="py-20 bg-[#23232a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">{t('about_values_title')}</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
            <p className="text-[#bfc1c6] font-light max-w-2xl mx-auto">
              {t('about_values_subtitle')}
            </p>
          </div>
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Gem,
                title: t('about_value_quality_title'),
                description: t('about_value_quality_desc'),
              },
              {
                icon: Heart,
                title: t('about_value_passion_title'),
                description: t('about_value_passion_desc'),
              },
              {
                icon: Award,
                title: t('about_value_excellence_title'),
                description: t('about_value_excellence_desc'),
              },
              {
                icon: Users,
                title: t('about_value_service_title'),
                description: t('about_value_service_desc'),
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-sm hover:shadow-[0_0_16px_#bfc1c6] transition-shadow duration-300 text-center bg-[#18181b]"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <value.icon className="w-12 h-12 text-[#bfc1c6]" />
                  </div>
                  <h3 className="text-xl font-light text-[#e5e7eb] mb-4 tracking-wide">{value.title}</h3>
                  <p className="text-[#bfc1c6] font-light leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Process */}
      <motion.section 
        className="py-20 bg-[#23232a]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#e5e7eb] mb-4">{t('about_process_title')}</h2>
            <div className="w-16 h-px bg-[#bfc1c6] mx-auto mb-6"></div>
            <p className="text-[#bfc1c6] font-light max-w-2xl mx-auto">{t('about_process_subtitle')}</p>
          </div>
          <div className="grid justify-center grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: t('about_process_step1'),
              },
              {
                step: "02",
                title: t('about_process_step2'),
              },
              {
                step: "03",
                title: t('about_process_step3'),
              },
              {
                step: "04",
                title: t('about_process_step4'),
              },
            ].map((process, index) => (
              <div key={index} className="space-y-4 text-center">
                <div className="text-4xl font-extralight text-[#bfc1c6] mb-4">{process.step}</div>
                <h3 className="text-xl font-light text-[#e5e7eb] tracking-wide">{process.title}</h3>
                <p className="text-[#bfc1c6] font-light leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-16 bg-[#18181b]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#e5e7eb] mb-4">
            {t('about_cta_title')}
          </h2>
          <p className="text-[#bfc1c6] font-light mb-8 max-w-2xl mx-auto">
            {t('about_cta_desc')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => router.push("/contact")}
              size="lg"
              className="bg-[#23232a] text-[#e5e7eb] hover:bg-[#18181b] px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 border border-[#bfc1c6]"
            >
              {t('about_cta_contact')}
            </Button>
            <Button
              onClick={() => router.push("/shop/products")}
              variant="outline"
              size="lg"
              className="border-[#bfc1c6] text-[#bfc1c6] hover:bg-[#23232a] px-8 py-3 text-sm font-light tracking-wide transition-all duration-300 bg-transparent"
            >
              {t('about_cta_collection')}
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
