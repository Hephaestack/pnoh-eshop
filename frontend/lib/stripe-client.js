"use client";

import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

/**
 * Create a Checkout Session via backend and redirect using Stripe.js
 * Accepts cart items array from the frontend. Each item should contain at least:
 *  - product_id OR product.id
 *  - quantity
 *  - optional product.name and product.price (number, euros)
 */
export async function startCheckout(cartItems, token) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Normalize items into a minimal payload: product_id and quantity. If price/name are present, include them
  const items = (cartItems || []).map((it) => {
    const product = it.product || {};
    return {
      product_id: product.id || it.product_id || it.id,
      quantity: 1,
      name: product.name || it.name,
      unit_amount:
        typeof product.price === "number"
          ? Math.round(product.price * 100)
          : undefined,
    };
  });

  const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
      items,
      success_url: `${window.location.origin}/checkout/success`,
      cancel_url: `${window.location.origin}/cart`,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed creating checkout session");
  }

  const data = await res.json();
  // If backend returned an absolute URL, navigate there directly
  if (data.url) {
    window.location.href = data.url;
    return;
  }

  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe.js failed to load");

  const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
  if (error) throw error;
}
