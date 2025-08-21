"use client";

import { useEffect } from "react";

/**
 * Hook to handle smooth page loading animations
 * Call this hook in any page component to ensure consistent animation behavior
 * 
 * @param {boolean} isReady - Optional condition to wait for before signaling page ready
 * @param {any[]} dependencies - Optional dependencies array for the effect
 */
export function usePageAnimation(isReady = true, dependencies = []) {
  useEffect(() => {
    if (isReady) {
      // Use requestAnimationFrame to ensure DOM is painted before signaling ready
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("page-ready"));
      });
    }
  }, [isReady, ...dependencies]);
}

export default usePageAnimation;
