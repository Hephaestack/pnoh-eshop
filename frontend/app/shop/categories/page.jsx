"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  const { t } = useTranslation();

  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  
  const categories = [
    {
      name: 'rings',
      image: '/placeholder-ring.jpg',
      href: '/shop/rings',
      themes: ['classic', 'ethnic', 'one-of-a-kind']
    },
    {
      name: 'bracelets', 
      image: '/placeholder-bracelet.jpg',
      href: '/shop/bracelets',
      themes: ['classic', 'ethnic', 'one-of-a-kind']
    },
    {
      name: 'necklaces',
      image: '/placeholder-necklace.jpg', 
      href: '/shop/necklaces',
      themes: ['classic', 'ethnic', 'one-of-a-kind']
    },
    {
      name: 'earrings',
      image: '/placeholder-earrings.jpg',
      href: '/shop/earrings', 
      themes: ['classic', 'ethnic', 'one-of-a-kind']
    }
  ];

  return (
    <motion.main 
      className="relative min-h-screen px-4 py-10 mx-auto max-w-7xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center mb-8">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-[#bcbcbc] tracking-tight text-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          {t('jewelry_categories', 'Jewelry Categories')}
        </motion.h1>
      </div>
      <motion.p 
        className="text-lg text-[#bcbcbc] mb-12 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        {t('categories_intro', 'Explore our different jewelry categories and discover the perfect piece for you')}
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {categories.map((category) => (
          <motion.div
            key={category.name}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl shadow-xl p-6 bg-[#232326]/60 border border-[#bcbcbc33] backdrop-blur-md backdrop-saturate-150 hover:border-[#bcbcbc55] transition-all"
            style={{boxShadow:'0 8px 32px 0 #23232a55'}}
          >
            <Link href={category.href}>
              <div className="w-full aspect-[4/3] bg-[#18181b] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img 
                  src={category.image} 
                  alt={t(category.name)} 
                  className="object-cover w-full h-full hover:scale-110 transition-transform" 
                />
              </div>
              <h2 className="text-2xl font-medium text-[#f8f8f8] mb-2">{t(category.name)}</h2>
              <p className="text-[#bcbcbc] text-sm mb-4">{t(`${category.name}_desc`)}</p>
            </Link>
            
            {/* Theme Links */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link 
                href={category.href}
                className="px-3 py-1 text-xs bg-[#18181b] text-[#f8f8f8] rounded-full hover:bg-[#232326] transition-colors border border-[#bcbcbc33]"
              >
                {t('all')}
              </Link>
              {category.themes.map((theme) => (
                <Link 
                  key={theme}
                  href={`${category.href}?theme=${theme}`}
                  className="px-3 py-1 text-xs bg-[#18181b] text-[#bcbcbc] rounded-full hover:bg-[#232326] hover:text-[#f8f8f8] transition-colors border border-[#bcbcbc33]"
                >
                  {t(theme.replace(/-/g, '_'))}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link 
          href="/shop/products"
          className="inline-block px-8 py-3 rounded-full bg-[#232326] text-[#f8f8f8] hover:bg-[#18181b] transition-colors border border-[#bcbcbc] font-medium"
        >
          {t('view_all_products', 'View All Products')}
        </Link>
      </div>
    </motion.main>
  );
}
