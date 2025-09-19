"use client";

import React, { useEffect, useState, Suspense } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../cart-context";
import { useTranslation } from "react-i18next";

function SuccessPageContent() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");
  const { clearCart } = useCart();
  const [status, setStatus] = useState("loading");
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const isDev = process.env.NODE_ENV !== 'production';

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
          process.env.NEXT_PUBLIC_API_URL;
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
          setMessage(t("checkout_success.payment_confirmed_message"));
          // clear local cart after confirmed payment
          clearCart();
          // cart cleared
          try {
            // avoid duplicate sends for same session
            const sentKey = `confirmation_email_sent_${sessionId}`;
            if (!localStorage.getItem(sentKey)) {
              const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
              const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_CONFIRMATION_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
              const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

              // Defensive mapping of order fields to template variables
              const customerName = data?.customer?.name || data?.customer_name || data?.billing?.name || data?.customer_email || "";
              const customerEmail = data?.customer?.email || data?.customer_email || data?.email || "";
              const orderId = data?.id || data?.order_id || sessionId || "";
              const orderDate = data?.created_at || data?.created || data?.order_date || new Date().toLocaleString();
              const totalRaw = data?.total || data?.amount_total || data?.order_total || data?.amount || 0;
              const orderTotal = typeof totalRaw === 'number' ? `€${totalRaw.toFixed(2)}` : String(totalRaw);

              // Build a structured orders array for EmailJS template
              const rawItems =
                data?.order?.items ||
                data?.items ||
                data?.order_items ||
                (data?.line_items && (Array.isArray(data.line_items) ? data.line_items : data.line_items.data)) ||
                [];

              let itemsHtml = '';
              let ordersArray = [];
              if (Array.isArray(rawItems) && rawItems.length > 0) {
                // Heuristic: decide if unit_amount is in cents (needs /100) or already in euros
                const qtySum = rawItems.reduce((s, it) => s + (Number(it.quantity || it.qty || it.count || 1)), 0);
                const totalFromBackend = (typeof data?.amount_total === 'number')
                  ? Number(data.amount_total)
                  : (typeof data?.order?.total_amount === 'number' ? Number(data.order.total_amount) : NaN);

                // Sum as-is and sum/100 to compare with order total
                const sumAsIs = rawItems.reduce((s, it) => s + (Number(it.unit_amount || it.price || 0) * (it.quantity || it.qty || it.count || 1)), 0);
                const sumDiv100 = rawItems.reduce((s, it) => s + ((Number(it.unit_amount || it.price || 0) / 100) * (it.quantity || it.qty || it.count || 1)), 0);

                // Choose the scale that is closer to backend total (if available), else fall back to as-is
                let useDivide = false;
                if (!isNaN(totalFromBackend)) {
                  useDivide = Math.abs(sumDiv100 - totalFromBackend) < Math.abs(sumAsIs - totalFromBackend);
                }

                ordersArray = rawItems.map((i) => {
                  const rawAmt = Number(i.unit_amount ?? i.price ?? 0);
                  const priceNumber = useDivide ? rawAmt / 100 : rawAmt;
                  return {
                    name: i.product_name || i.name || i.title || i.description || 'Item',
                    units: i.quantity || i.qty || i.count || 1,
                    price: `€${Number(priceNumber).toFixed(2)}`,
                  };
                });
                // Optionally keep itemsHtml for legacy templates
                itemsHtml = ordersArray.map(o => `${o.units}× ${o.name}`).join('<br/>');
              } else {
                itemsHtml = 'No items listed';
              }

              // Prefer backend computed shipping_address if present
              const shippingAddress =
                (data?.order && data.order.shipping_address) ||
                (typeof data?.shipping_address === 'string' && data.shipping_address) ||
                (data?.shipping && (typeof data.shipping === 'string' ? data.shipping : JSON.stringify(data.shipping))) ||
                (data?.shipping_details && (data.shipping_details.address || JSON.stringify(data.shipping_details))) ||
                (data?.customer_details && (data.customer_details.address || JSON.stringify(data.customer_details))) ||
                'Not provided';

              // Payment method fallbacks
              const paymentMethod =
                data?.payment_method ||
                (data?.payment && (data.payment.method || JSON.stringify(data.payment))) ||
                (data?.payment_intent && (data.payment_intent.payment_method || JSON.stringify(data.payment_intent))) ||
                (data?.payment_method_details && JSON.stringify(data.payment_method_details)) ||
                'Not provided';

              // Provide safe defaults so template fields are never empty
              const templateParams = {
                customer_name: customerName || customerEmail || 'Αγαπητέ πελάτη',
                customer_email: customerEmail || '',
                order_id: orderId || '',
                order_date: orderDate || new Date().toLocaleString(),
                order_total: orderTotal || '',
                order_items: itemsHtml || 'No items listed', // legacy
                orders: ordersArray, // structured array for EmailJS template
                shipping_address: shippingAddress || 'Not provided',
                to_email: customerEmail || '',
              };

              // Expose the payload and chosen template/service in console for debugging (dev only)
              if (isDev) {
                console.info('[EmailJS] prepared templateParams:', {
                serviceId,
                templateId,
                publicKey,
                templateParams,
                sessionId,
                rawOrderData: data,
                });
                // Print each order object for clarity
                if (templateParams.orders && Array.isArray(templateParams.orders)) {
                  templateParams.orders.forEach((order, idx) => {
                    console.info(`[EmailJS] order[${idx}]:`, order);
                  });
                }
              }

              if (serviceId && templateId && publicKey) {
                // send email and capture response for debugging
                emailjs.send(serviceId, templateId, templateParams, publicKey)
                  .then((resp) => {
                    try { localStorage.setItem(sentKey, '1'); } catch(e) {}
                    if (isDev) console.log('[EmailJS] send success', resp);
                  })
                  .catch(err => {
                    console.error('[EmailJS] send failed', err);
                  });
              } else {
                console.warn('EmailJS env vars not set; skipping confirmation email');
              }
            }
          } catch (e) {
            console.error('Error while attempting to send confirmation email', e);
          }
        } else {
          // payment pending
          setStatus("pending");
          setMessage(t("checkout_success.payment_pending_message"));
        }
      } catch (err) {
        console.error("💥 Error during order confirmation:", err);
        setStatus("error");
        setMessage(err?.message || "Confirmation failed");
      }
    }

    confirm();
  }, [sessionId, clearCart, t]);

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
            ? t("checkout_success.title_paid")
            : status === "loading"
            ? t("checkout_success.title_loading")
            : t("checkout_success.title_error")}
        </h1>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="space-x-4">
          <Link href="/shop/products" className="text-white underline">
            {t("checkout_success.continue_shopping")}
          </Link>
          <Link href="/" className="text-gray-400">
            {t("checkout_success.home")}
          </Link>
          </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#18181b] pt-16 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
