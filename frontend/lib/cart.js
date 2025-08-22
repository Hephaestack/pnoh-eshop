

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

export async function mergeCart(token) {
  if (!token) {
    throw new Error('Token is required for cart merge');
  }
  
  // Get guest cart data from localStorage
  const guestCartData = localStorage.getItem('cart');
  const guestCart = guestCartData ? JSON.parse(guestCartData) : { items: [] };
  try {
    console.debug('[mergeCart] token length', token ? token.length : 0);
    console.debug('[mergeCart] sending guestCart', guestCart);
    const res = await fetch(`${API_BASE}/merge/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is always included
      },
      body: JSON.stringify({ guestCart }),
      credentials: "include",
    });

    console.debug('[mergeCart] response status', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '<no-body>');
      console.error('[mergeCart] non-ok response', res.status, res.statusText, errorText);
      throw new Error(`Failed to merge cart: ${res.status} ${res.statusText} - ${errorText}`);
    }

    // If 204 No Content, return null (caller should fetch /cart)
    if (res.status === 204) {
      console.debug('[mergeCart] 204 No Content from merge endpoint');
      return null;
    }

    const json = await res.json().catch(() => null);
    console.debug('[mergeCart] response json', json);
    return json;
  } catch (err) {
    // Surface the error in console for easier debugging in browser DevTools
    console.error('[mergeCart] error', err);
    throw err;
  }
}
