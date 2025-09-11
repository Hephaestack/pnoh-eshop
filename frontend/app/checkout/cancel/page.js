"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function CancelPage() {
  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#18181b] pt-16">
      <div className="container px-4 mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t("checkout_cancel.title")}
        </h1>
        <p className="text-gray-300 mb-6">{t("checkout_cancel.message")}</p>
        <div className="space-x-4">
          <Link href="/cart" className="text-white underline">
            {t("checkout_cancel.return_to_cart")}
          </Link>
          <Link href="/shop/products" className="text-gray-400">
            {t("checkout_cancel.continue_shopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
