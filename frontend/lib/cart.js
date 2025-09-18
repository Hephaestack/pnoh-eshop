

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
    // If the item or cart is already gone, treat as success to avoid noisy UI errors
    if (res.status === 404) {
      return true;
    }
    const errorText = await res.text();
    throw new Error(errorText);
  }

  // Some backends return 204 No Content; normalize to boolean success for callers
  return true;
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
  
  // mergeCart called
  
  try {
    const res = await fetch(`${API_BASE}/merge/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ensure token is always included
      },
      body: JSON.stringify({ guestCart }),
      credentials: "include",
    });
    
  // merge cart API response status available
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '<no-body>');
      console.error("❌ Merge cart API failed:", errorText);
      throw new Error(`Failed to merge cart: ${res.status} ${res.statusText} - ${errorText}`);
    }

    // If 204 No Content, return null (caller should fetch /cart)
    if (res.status === 204) {
      try {
        // backend didn't return the merged cart; fetch canonical cart now
        const canonical = await getCart(token);
        try {
          localStorage.setItem('cart_merged', '1');
        } catch (e) {
          // ignore storage errors
        }
        return canonical;
      } catch (fetchErr) {
        return null;
      }
    }

    const json = await res.json().catch(() => null);
    try {
      localStorage.setItem('cart_merged', '1');
    } catch (e) {
      // ignore storage errors
    }
    return json;
  } catch (err) {
    throw err;
    throw err;
  }
}
