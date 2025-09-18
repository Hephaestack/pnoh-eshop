"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const EnhancedPaginationBar = ({
  currentPage,
  totalPages,
  onGoToPage,
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
  const { t } = useTranslation();

  // Generate visible page numbers with mobile responsiveness
  const getVisiblePages = () => {
    const pages = [];
    // Show fewer pages on mobile to prevent overflow
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxPages = isMobile ? 5 : 7; // Show 5 pages on mobile, 7 on desktop
    
    if (totalPages <= maxPages) {
      // If total pages is small, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first few pages, then dots, then last page
      const showFirst = isMobile ? 4 : 5; // Show first 4-5 pages
      
      if (currentPage <= showFirst) {
        // Show first pages: 1 2 3 4 5 ... 10
        for (let i = 1; i <= showFirst; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - (isMobile ? 2 : 3)) {
        // Show last pages: 1 ... 6 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (isMobile ? 3 : 4); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        const delta = isMobile ? 1 : 1;
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-12 w-full">
      {/* Page info */}
      <div className="mb-6 text-center">
        <span className="text-sm font-serif text-neutral-300">
          {t("showing", "Showing")} {t("page", "page")} {currentPage} {t("of", "of")} {totalPages}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 px-2 overflow-x-auto">
        {/* Previous button */}
        <motion.button
          onClick={onGoToPreviousPage}
          disabled={currentPage === 1}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed border border-neutral-600"
          whileHover={currentPage !== 1 ? { 
            backgroundColor: "#404040"
          } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Page numbers */}
        {visiblePages.map((page, index) => (
          <motion.button
            key={index}
            onClick={() => page !== '...' && onGoToPage(page)}
            disabled={page === '...'}
            className={`
              flex-shrink-0 flex items-center justify-center min-w-[2rem] sm:min-w-[2.5rem] h-8 sm:h-10 px-2 sm:px-3 rounded-md font-medium text-xs sm:text-sm transition-all border
              ${page === currentPage
                ? 'bg-white text-black border-neutral-400 shadow-md' 
                : page === '...'
                ? 'bg-transparent text-neutral-400 cursor-default border-transparent'
                : 'bg-neutral-800 text-white border-neutral-600 hover:bg-neutral-700'
              }
            `}
            whileHover={page !== '...' && page !== currentPage ? { 
              backgroundColor: "#404040",
              scale: 1.05
            } : {}}
            whileTap={page !== '...' && page !== currentPage ? { scale: 0.95 } : {}}
          >
            {page}
          </motion.button>
        ))}

        {/* Next button */}
        <motion.button
          onClick={onGoToNextPage}
          disabled={currentPage === totalPages}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed border border-neutral-600"
          whileHover={currentPage !== totalPages ? { 
            backgroundColor: "#404040"
          } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>
    </div>
  );
};

export default EnhancedPaginationBar;
