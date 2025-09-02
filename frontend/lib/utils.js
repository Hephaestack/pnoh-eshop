import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function searchProducts(query) {
  try {
    const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Search request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
