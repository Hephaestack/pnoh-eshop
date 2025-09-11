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
export async function startCheckout(cartItems, token, options = {}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Ensure we're in browser environment
  if (typeof window === 'undefined') {
    throw new Error('Checkout can only be initiated from the browser');
  }

  // Get the current origin and ensure it's a valid URL
  const origin = window.location.origin;
  if (!origin || (!origin.startsWith('http://') && !origin.startsWith('https://'))) {
    throw new Error('Invalid origin URL');
  }

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

  // Create absolute URLs for success and cancel pages
  const successUrl = `${origin}/checkout/success`;
  const cancelUrl = `${origin}/cart`;


  const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
      items,
      success_url: successUrl,
      cancel_url: cancelUrl,
  ...(options?.delivery_method ? { delivery_method: options.delivery_method } : {}),
    }),
  });

  if (!res.ok) {
  const txt = await res.text();
    throw new Error(txt || `Failed creating checkout session (${res.status})`);
  }

  const data = await res.json();
  
  // Validate response data
  if (!data.url) {
    throw new Error('No checkout URL received from server');
  }

  // Validate the URL format
  try {
    new URL(data.url);
  } catch (e) {
    throw new Error('Invalid checkout URL received from server');
  }
  
  // If backend returned an absolute URL, navigate there directly
  window.location.href = data.url;
  return;

  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe.js failed to load");

  const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
  if (error) throw error;
}
