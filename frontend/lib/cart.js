// cart.js - Utility for cart API operations

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function addToCart(productId, quantity, token) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ quantity }),
    credentials: "include", // Important for guest session cookies
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function getCart(token) {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 404) {
      // No cart found, return empty cart
      return { items: [] };
    }
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function removeFromCart(productId, token) {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return;
}

export async function updateCartItem(itemId, quantity, token) {
  // For now, this will need a backend endpoint to be implemented
  // Using placeholder for API structure
  const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ quantity }),
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}
