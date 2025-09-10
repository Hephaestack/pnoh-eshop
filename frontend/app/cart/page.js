"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { motion } from "framer-motion";

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
  const [hasRenderedContent, setHasRenderedContent] = useState(false);
  // Delivery selection: 'now' -> +2€, 'genikh' -> +10€
  // Assumption: default to 'now' as requested (client-only, no backend yet)
  const [delivery, setDelivery] = useState("now");
  const DELIVERY_FEES = { now: 2, genikh: 10 };

  const { cart, removeFromCart, updateCartItem, loading, isItemBeingRemoved } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Signal page ready for cart page
  useEffect(() => {
    if (mounted && !loading) {
      // Reset scroll position to top when cart page loads
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event("page-ready"));
    }
  }, [mounted, loading]);

  // Calculate totals from cart data
  const getTotals = () => {
    if (!cart?.items)
      return { itemCount: 0, subtotal: 0, shipping: 0, total: 0 };

    // No quantity support for now: each item counts as 1
    const itemCount = cart.items.length;
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.price || 0),
      0
    );
    // Round up the subtotal
    const roundedSubtotal = Math.ceil(subtotal);
    
  // Delivery fee from UI selection (delivery state). Only UI fees apply: 2€ (Box Now) or 10€ (Γενική Ταχυδρομική)
  const deliveryFee = DELIVERY_FEES[delivery] || 0;

  // Final shipping shown to user is only the selected delivery fee
  const shipping = deliveryFee;

  // No VAT/tax included - prices are final
  const total = roundedSubtotal + shipping;

    return { itemCount, subtotal: roundedSubtotal, shipping, total };
  };

  const totals = getTotals();

  // Determine if any items are missing price data (optimistic entries)
  const itemsMissingPrice = !!(
    cart?.items && cart.items.some((it) => typeof it.product?.price !== "number")
  );

  const SmallSpinner = ({ size = 4 }) => (
    <span
      className={`inline-block rounded-full border-2 border-t-transparent border-gray-400 animate-spin`} 
      style={{ width: `${size}rem`, height: `${size}rem` }}
      aria-hidden="true"
    />
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mark that we've rendered content once we have cart data (empty or with items)
  useEffect(() => {
    if (mounted && cart !== null) {
      setHasRenderedContent(true);
    }
  }, [mounted, cart]);

  // If we already have a local cart with items, render immediately so the
  // user doesn't see the full-page loading skeleton. Show the skeleton only
  // when there are no local items yet.
  const hasLocalItems = cart?.items && cart.items.length > 0;

  // Only show skeleton if:
  // 1. Component hasn't mounted yet, OR
  // 2. We're loading AND we haven't rendered any content yet
  // This prevents flickering between skeleton and empty state
  
  const isShowingSkeleton = loading && !hasRenderedContent;

  if (isShowingSkeleton) {
    return (
      <div className="min-h-screen bg-[#18181b] pt-8">
        <div className="container px-4 mx-auto">
          <div className="py-8">
            <div className="space-y-6">
              <div className="h-8 w-1/3 bg-gray-700 rounded animate-pulse" />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-[#232326] rounded border border-gray-700 animate-pulse">
                      <div className="w-24 h-24 bg-gray-700 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-gray-700 rounded" />
                        <div className="h-4 w-1/2 bg-gray-700 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1 space-y-4">
                  <div className="p-4 bg-[#232326] rounded border border-gray-700 animate-pulse">
                    <div className="h-4 w-1/2 bg-gray-700 rounded mb-4" />
                    <div className="h-4 w-full bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-3/4 bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
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
                {t("cart.continue_shopping")}
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
                  {cart.items.map((item, idx) => (
                    <div
                      key={item.product_id || item.id || idx}
                      className="flex flex-row items-center gap-3 p-3 bg-transparent sm:bg-[#18181b] rounded-none sm:rounded-lg border-none sm:border border-gray-700/60"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {item.product?.image_url?.[0] ? (
                          <Image
                            src={item.product.image_url[0].replace(
                              "dl=0",
                              "raw=1"
                            )}
                            alt={item.product?.name || "Product"}
                            width={96}
                            height={96}
                            className="object-cover w-20 h-20 rounded-md sm:w-24 sm:h-24 sm:rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-md bg-[#1f1f23] sm:w-24 sm:h-24 sm:rounded-lg flex items-center justify-center text-gray-500">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5-5 5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
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
                          {item.product?.name ? (
                            item.product.name
                          ) : (
                            <span className="inline-block w-40 h-4 bg-gray-700 rounded" />
                          )}
                        </h3>
                      </div>

                      {/* Price & Actions (right aligned) */}
                      <div className="flex flex-col items-end ml-2 space-y-2">
                        <p className="text-lg font-bold text-white sm:text-2xl">
                          {typeof item.product?.price === "number" ? (
                            `€${item.product.price}`
                          ) : (
                            <span className="inline-block w-16 h-5 bg-gray-700 rounded" />
                          )}
                        </p>

                        <div className="flex items-center space-x-3">
                          <span className="text-white font-semibold min-w-[2rem] text-center text-sm">
                            1
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              // Get product id (stable across sessions) and fall back to product_id
                              const id = item.product?.id || item.product_id;
                              if (!id || isItemBeingRemoved(id)) {
                                return; // Don't allow clicking if already being removed
                              }
                              
                              const ok = await removeFromCart(id);
                              if (!ok) {
                                // Show error feedback only if removal actually failed
                                console.error('Failed to remove item from cart');
                              }
                            }}
                            disabled={isItemBeingRemoved(item.product?.id || item.product_id)}
                            className={`p-2 transition-all duration-200 ${
                              isItemBeingRemoved(item.product?.id || item.product_id)
                                ? "text-red-300 bg-red-900/30 cursor-not-allowed" 
                                : "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            }`}
                            aria-live="polite"
                          >
                            {isItemBeingRemoved(item.product?.id || item.product_id) ? (
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
                    </div>
                  ))}
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
                  {/* Delivery options (client-only) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">{t("cart.delivery_method") || "Delivery method"}</label>
                    <div className="flex items-stretch gap-3">
                      <button
                        type="button"
                        onClick={() => setDelivery("now")}
                        className={`flex-1 text-left p-3 rounded border flex flex-col justify-between ${delivery === "now" ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-transparent"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-semibold text-white">Box Now</div>
                            <div className="text-xs text-gray-400">{t("cart.delivery_now_desc") || "Fast local delivery"}</div>
                          </div>
                          <div className="text-sm text-gray-200">€2</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDelivery("genikh")}
                        className={`flex-1 text-left p-3 rounded border flex flex-col justify-between ${delivery === "genikh" ? "border-blue-500 bg-blue-900/20" : "border-gray-700 bg-transparent"}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-semibold text-white">Γενική Ταχυδρομική</div>
                            <div className="text-xs text-gray-400">{t("cart.delivery_genikh_desc") || "Standard courier"}</div>
                          </div>
                          <div className="text-sm text-gray-200">€10</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300 items-center">
                      <span className="flex items-center space-x-2">
                        <span>{t("cart.subtotal")} ({totals.itemCount} {totals.itemCount === 1 ? t("cart.product") : t("cart.products")})</span>
                        {(itemsMissingPrice || loading) && <SmallSpinner size={2} />}
                      </span>
                      <span>
                        {itemsMissingPrice || loading ? (
                          <span className="inline-block w-16 h-5 bg-gray-700 rounded" />
                        ) : (
                          `€${totals.subtotal}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300 items-center">
                      <span className="flex items-center space-x-2">
                        <span>{t("cart.shipping")}</span>
                        {(itemsMissingPrice || loading) && (
                          <SmallSpinner size={2} />
                        )}
                      </span>
                      <span>
                        {itemsMissingPrice || loading ? (
                          <span className="inline-block w-12 h-5 bg-gray-700 rounded" />
                        ) : totals.shipping === 0 ? (
                          t("cart.free_shipping_message")
                        ) : (
                          `€${totals.shipping}`
                        )}
                      </span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>{t("cart.total")}</span>
                      <span>
                        {itemsMissingPrice ? (
                          <span className="inline-block w-20 h-6 bg-gray-700 rounded" />
                        ) : (
                          `€${totals.total}`
                        )}
                      </span>
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
                      className="w-full font-semibold text-black bg-white hover:bg-gray-100 disabled:opacity-50"
                      disabled={loading || isCheckingOut}
                      onClick={async () => {
                        // Check if user is authenticated before proceeding to checkout
                        if (!isSignedIn || !user) {
                          // Show checkout auth modal instead of redirecting
                          setShowAuthModal(true);
                          return;
                        }

                        try {
                          setIsCheckingOut(true);
                          // Get token for authenticated request
                          const token = await getToken();
                          await startCheckout(cart.items, token);
                        } catch (err) {
                          alert(err?.message || t("cart.checkout_failed"));
                        } finally {
                          setIsCheckingOut(false);
                        }
                      }}
                    >
                      {isCheckingOut ? (
                        <>
                          <SmallSpinner size={1} />
                          <span className="ml-2">{t("cart.processing_checkout")}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          {t("cart.secure_checkout")}
                        </>
                      )}
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
