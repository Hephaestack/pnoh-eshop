# pnoh-eshop (frontend)

This folder contains the Next.js frontend for the pnoh e-shop.

Stripe integration (frontend)

What was added

- `lib/stripe-client.js` — helper that loads `@stripe/stripe-js`, calls your backend `/stripe/create-checkout-session` and redirects the user to Stripe Checkout.
- `app/checkout/page.js` — a client Checkout page wired to your existing `CartProvider` that sends the current cart to the backend and starts checkout.
- `app/checkout/success/page.js` — a simple success landing page users return to after payment.

Quick setup

1. Add the publishable key to your frontend env (create `.env.local` in `frontend/`):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

2. Install the client Stripe package:

```powershell
# from frontend/ folder (Windows PowerShell)
cd frontend
npm install @stripe/stripe-js
```

3. The backend must implement `POST /stripe/create-checkout-session` which accepts a payload `{ items, success_url, cancel_url }` and returns `{ id }` or `{ url }`. The backend must compute/validate prices server-side.

4. For local testing of webhooks use the Stripe CLI:

```powershell
stripe listen --forward-to localhost:8000/stripe/webhook
```

Notes

- The frontend sends cart items as-is; do NOT trust client prices. Backend must compute/validate amounts before creating the Stripe Session.
- I updated the Cart page button to call the checkout flow directly. If you'd prefer the old Link/navigation flow, I can revert it.
