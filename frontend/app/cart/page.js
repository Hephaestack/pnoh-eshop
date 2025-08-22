"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Lock,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "../cart-context";
import { startCheckout } from "../../lib/stripe-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CheckoutAuthModal from "../../components/checkout-auth-modal";

function CartPageInner() {
  const { t } = useTranslation();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { cart, removeFromCart, updateCartItem, loading } = useCart();
  const [removing, setRemoving] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Signal page ready for cart page
  useEffect(() => {
    if (mounted && !loading) {
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [mounted, loading]);

  // Calculate totals from cart data
  const getTotals = () => {
    if (!cart?.items)
      return { itemCount: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };

    // No quantity support for now: each item counts as 1
    const itemCount = cart.items.length;
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0),
      0
    );
    const shipping = subtotal >= 50 ? 0 : 5; // Free shipping over €50
    const tax = subtotal * 0.24; // 24% VAT
    const total = subtotal + shipping + tax;

    return { itemCount, subtotal, shipping, tax, total };
  };

  const totals = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container px-4 mx-auto">
          <div className="animate-pulse">
            <div className="w-1/4 h-8 mb-8 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="bg-gray-700 rounded h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center"
          >
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h1 className="mb-4 text-3xl font-bold text-white">
              {t("cart.empty_title")}
            </h1>
            <p className="max-w-md mx-auto mb-8 text-gray-400">
              {t("cart.empty_desc")}
            </p>
            <Link href="/shop/products">
              <Button className="text-black bg-white hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("cart.continue_shopping")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] pt-8 pb-16">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 mb-8 sm:flex-row sm:items-center"
        >
          <div className="flex items-center space-x-4">
            <Link href="/shop/products">
              <Button
                variant="ghost"
                className="text-white hover:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Συνέχεια Αγορών
              </Button>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {t("cart.header", { count: totals.itemCount })}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-[#232326] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("cart.items_title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence>
                  {cart.items.map((item, idx) => (
                    <motion.div
                      key={item.product_id || item.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-row items-center gap-3 p-3 bg-transparent sm:bg-[#18181b] rounded-none sm:rounded-lg border-none sm:border border-gray-700/60"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={
                            item.product?.image_url?.[0]?.replace(
                              "dl=0",
                              "raw=1"
                            ) || "/placeholder-product.jpg"
                          }
                          alt={item.product?.name || "Product"}
                          className="object-cover w-20 h-20 rounded-md sm:w-24 sm:h-24 sm:rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 pr-2">
                        <h3
                          className="text-sm font-semibold text-white sm:text-lg"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.product?.name || "Unknown Product"}
                        </h3>
                      </div>

                      {/* Price & Actions (right aligned) */}
                      <div className="flex flex-col items-end ml-2 space-y-2">
                        <p className="text-lg font-bold text-white sm:text-2xl">
                          €{item.product?.price || 0}
                        </p>

                        <div className="flex items-center space-x-3">
                          <span className="text-white font-semibold min-w-[2rem] text-center text-sm">
                            1
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              const id =
                                item.product?.id || item.product_id || item.id;
                              if (!id) return;
                              setRemoving(id);
                              const ok = await removeFromCart(id);
                              setRemoving(null);
                              if (!ok) {
                                console.error(
                                  "Failed to remove item from cart",
                                  id
                                );
                                alert(
                                  t("error_removing_item") ||
                                    "Failed to remove item from cart"
                                );
                              }
                            }}
                            disabled={
                              removing ===
                              (item.product?.id || item.product_id || item.id)
                            }
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            aria-live="polite"
                          >
                            {removing ===
                            (item.product?.id || item.product_id || item.id) ? (
                              <span className="flex items-center space-x-2 text-sm text-red-300">
                                <span
                                  className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full border-red-400"
                                  aria-hidden="true"
                                />
                                <span>{t("cart.deleting")}</span>
                              </span>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
            {/* Trust Badges - show under product list on large screens */}
            <div className="hidden lg:block">
              <Card className="bg-[#232326] border-gray-700 mt-4">
                <CardContent className="pt-6">
                  <div className="grid items-center grid-cols-3 gap-6 text-sm text-gray-300">
                    <div className="col-span-2">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{t("cart.trust_free_shipping")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{t("cart.trust_return_policy")}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{t("cart.trust_handmade")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 text-sm text-right text-gray-300">
                      <blockquote className="italic text-gray-200">
                        {t("cart.thank_you_quote")}
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-8"
            >
              <Card className="bg-[#232326] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {t("cart.order_summary")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>
                        {t("cart.subtotal")} ({totals.itemCount} προϊόντα)
                      </span>
                      <span>€{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>{t("cart.shipping")}</span>
                      <span>
                        {totals.shipping === 0
                          ? t("cart.free_shipping_message")
                          : `€${totals.shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>{t("cart.tax")}</span>
                      <span>€{totals.tax}</span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>{t("cart.total")}</span>
                      <span>€{totals.total}</span>
                    </div>
                  </div>

                  {totals.shipping === 0 && (
                    <div className="p-3 border border-green-700 rounded-lg bg-green-900/20">
                      <p className="text-sm text-center text-green-400">
                        {t("cart.free_shipping_message")}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full font-semibold text-black bg-white hover:bg-gray-100"
                      disabled={loading}
                      onClick={async () => {
                        // Check if user is authenticated before proceeding to checkout
                        if (!isSignedIn || !user) {
                          // Show checkout auth modal instead of redirecting
                          setShowAuthModal(true);
                          return;
                        }

                        try {
                          // Get token for authenticated request
                          const token = await getToken();
                          await startCheckout(cart.items, token);
                        } catch (err) {
                          console.error("Checkout failed", err);
                          alert(err?.message || t("cart.checkout_failed"));
                        }
                      }}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {t("cart.secure_checkout")}
                    </Button>

                    <div className="flex items-center justify-center mt-4 space-x-2 text-xs text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>{t("cart.secure_payment_note")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges (small screens only) */}
              <Card className="bg-[#232326] border-gray-700 mt-4 lg:hidden">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-3 sm:items-center">
                      <div className="flex-shrink-0 w-2 h-2 mt-1 bg-green-500 rounded-full"></div>
                      <span>{t("cart.trust_free_shipping")}</span>
                    </div>
                    <div className="flex items-start space-x-3 sm:items-center">
                      <div className="flex-shrink-0 w-2 h-2 mt-1 bg-green-500 rounded-full"></div>
                      <span>{t("cart.trust_return_policy")}</span>
                    </div>
                    <div className="flex items-start space-x-3 sm:items-center">
                      <div className="flex-shrink-0 w-2 h-2 mt-1 bg-green-500 rounded-full"></div>
                      <span>{t("cart.trust_handmade")}</span>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <blockquote className="italic text-gray-200">
                      {t("cart.thank_you_quote")}
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Checkout Auth Modal */}
      <CheckoutAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        cartTotal={totals.total.toFixed(2)}
      />
    </div>
  );
}

export default function CartPage() {
  return <CartPageInner />;
}
