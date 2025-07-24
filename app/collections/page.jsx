"use client"


import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";


export default function JewelryPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <main className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#bcbcbc] tracking-tight text-center w-full">
          {t('all_jewelry')}
        </h1>
      </div>
      <p className="text-lg text-[#bcbcbc] mb-12 text-center max-w-2xl mx-auto">
        {t('collections_intro')}
      </p>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Example product cards, replace with dynamic data later */}
        <div className="rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150" style={{boxShadow:'0 8px 32px 0 #23232a55'}}>
          <div className="w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img src="/placeholder-ring.jpg" alt={t('rings')} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-lg font-medium text-[#f8f8f8] mb-1">{t('rings')}</h2>
          <p className="text-[#bcbcbc] text-sm mb-2">{t('ring_desc')}</p>
          <span className="text-[#f8f8f8] font-semibold">€45</span>
        </div>
        <Link href="/bracelets/1" className="rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:scale-[1.03] transition-transform" style={{boxShadow:'0 8px 32px 0 #23232a55'}}>
          <div className="w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img src="/placeholder-bracelet.jpg" alt={t('bracelets')} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-lg font-medium text-[#f8f8f8] mb-1">{t('bracelets')}</h2>
          <p className="text-[#bcbcbc] text-sm mb-2">{t('bracelet_desc')}</p>
          <span className="text-[#f8f8f8] font-semibold">€60</span>
        </Link>
        <div className="rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150" style={{boxShadow:'0 8px 32px 0 #23232a55'}}>
          <div className="w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img src="/placeholder-necklace.jpg" alt={t('necklaces')} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-lg font-medium text-[#f8f8f8] mb-1">{t('necklaces')}</h2>
          <p className="text-[#bcbcbc] text-sm mb-2">{t('necklace_desc')}</p>
          <span className="text-[#f8f8f8] font-semibold">€80</span>
        </div>
        <div className="rounded-xl shadow-xl p-4 flex flex-col items-center bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150" style={{boxShadow:'0 8px 32px 0 #23232a55'}}>
          <div className="w-full aspect-square bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img src="/placeholder-earrings.jpg" alt={t('earrings')} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-lg font-medium text-[#f8f8f8] mb-1">{t('earrings')}</h2>
          <p className="text-[#bcbcbc] text-sm mb-2">{t('earring_desc')}</p>
          <span className="text-[#f8f8f8] font-semibold">€35</span>
        </div>
      </div>
      {/* Category links */}
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <Link href="/rings" className="px-6 py-2 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc]">{t('rings')}</Link>
        <Link href="/bracelets" className="px-6 py-2 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc]">{t('bracelets')}</Link>
        <Link href="/necklaces" className="px-6 py-2 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc]">{t('necklaces')}</Link>
        <Link href="/earrings" className="px-6 py-2 rounded-full bg-[#232326] text-[#bcbcbc] hover:bg-[#18181b] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc]">{t('earrings')}</Link>
      </div>
    </main>
  );
}
