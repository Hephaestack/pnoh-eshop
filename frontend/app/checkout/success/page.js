"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../cart-context";

export default function SuccessPage() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Missing session id");
      return;
    }

    async function confirm() {
      try {
  // confirming order with session id
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${API_BASE}/orders/confirm?session_id=${encodeURIComponent(
            sessionId
          )}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          console.error("❌ Order confirmation failed:", txt);
          throw new Error(txt || "Failed to confirm order");
        }
        const data = await res.json();
  // order confirmation response available
        
        if (data?.payment_status === "paid" || data?.payment_intent_status === "succeeded") {
          // payment confirmed; clear cart
          setStatus("paid");
          setMessage(
            "Η πληρωμή επιβεβαιώθηκε — ευχαριστούμε για την παραγγελία!"
          );
          // clear local cart after confirmed payment
          clearCart();
          // cart cleared
        } else {
          // payment pending
          setStatus("pending");
          setMessage(
            "Η πληρωμή φαίνεται εκκρεμής. Θα ενημερωθείτε μόλις ολοκληρωθεί."
          );
        }
      } catch (err) {
        console.error("💥 Error during order confirmation:", err);
        setStatus("error");
        setMessage(err?.message || "Confirmation failed");
      }
    }

    confirm();
  }, [sessionId, clearCart]);

  // Signal page ready for smooth loading animation after status is determined
  useEffect(() => {
    if (status !== "loading") {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#18181b] pt-16">
      <div className="container px-4 mx-auto text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">
          {status === "paid"
            ? "Ευχαριστούμε για την παραγγελία!"
            : status === "loading"
            ? "Επεξεργασία..."
            : "Πρόβλημα στην επιβεβαίωση"}
        </h1>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="space-x-4">
          <Link href="/shop/products" className="text-white underline">
            Συνέχεια Αγορών
          </Link>
          <Link href="/" className="text-gray-400">
            Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}
