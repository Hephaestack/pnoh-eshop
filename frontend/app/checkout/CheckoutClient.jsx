"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getStripe, startCheckout } from "../../lib/stripe-client";
import { useCart } from "../cart-context";
import { useRequireAuth } from "../../lib/useRequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutClient() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getToken } = useAuth();
  const { cart, loading } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Signal page ready for checkout page
  useEffect(() => {
    if (!loading) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [loading]);

  if (loading) return <div className="p-8">Loading...</div>;
  // Require authentication - redirect to login if not authenticated
  const { isAuthenticating } = useRequireAuth('/checkout');

  // Show loading while authentication is being checked
  if (isAuthenticating) return <div className="p-8 text-white">Checking authentication...</div>;

  if (loading) return <div className="p-8 text-white">Loading cart...</div>;
  if (!cart || !cart.items || cart.items.length === 0)
    return (
      <div className="p-8 text-center">
        <h2 className="text-white">Το καλάθι σας είναι άδειο</h2>
        <Link href="/shop/products">Πήγαινε στο κατάστημα</Link>
      </div>
    );

  const totals = cart.items.reduce((sum, it) => {
    return sum + (it.product?.price || 0) * 1;
  }, 0);

  async function handleCheckout() {
    setProcessing(true);
    setError(null);
    try {
      const token = await getToken();
      await startCheckout(cart.items, token);
      router.push("/checkout/success");
    } catch (err) {
  setError(err.message || "Checkout failed");
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#18181b] pt-8 pb-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Στοιχεία Παραγγελίας</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.items.map((it, idx) => (
                  <div
                    key={it.product_id || it.id || idx}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <div className="text-white">{it.product?.name || "Product"}</div>
                      <div className="text-gray-400">Qty: 1</div>
                    </div>
                    <div className="text-white">€{(it.product?.price || 0) * 1}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Πληρωμή</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Σύνολο</span>
                    <span>€{totals}</span>
                  </div>

                  {error && <div className="text-sm text-red-400">{error}</div>}

                  <Button
                    className="w-full font-semibold text-black bg-white hover:bg-gray-100"
                    onClick={handleCheckout}
                    disabled={processing}
                  >
                    Πληρωμή με κάρτα
                  </Button>

                  <div className="mt-4 text-xs text-gray-400">
                    Θα μεταφερθείτε στο Stripe για να ολοκληρώσετε την πληρωμή.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
