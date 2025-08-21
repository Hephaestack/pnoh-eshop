"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function CancelPage() {
  // Signal page ready for smooth loading animation
  useEffect(() => {
    window.dispatchEvent(new Event("page-ready"));
  }, []);
  return (
    <div className="min-h-screen bg-[#18181b] pt-16">
      <div className="container px-4 mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Πληρωμή ακυρώθηκε
        </h1>
        <p className="text-gray-300 mb-6">
          Δεν ολοκληρώθηκε η πληρωμή. Μπορείτε να προσπαθήσετε ξανά ή να
          επικοινωνήσετε μαζί μας.
        </p>
        <div className="space-x-4">
          <Link href="/cart" className="text-white underline">
            Επιστροφή στο καλάθι
          </Link>
          <Link href="/shop/products" className="text-gray-400">
            Συνέχεια Αγορών
          </Link>
        </div>
      </div>
    </div>
  );
}
