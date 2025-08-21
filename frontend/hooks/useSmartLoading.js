import { useState, useRef, useEffect } from 'react';

/**
 * Smart loading hook that only shows loading states when operations actually take time
 * @param {number} delay - Delay before showing loading (default: 200ms)
 * @param {number} minimumDuration - Minimum time to show loading once visible (default: 150ms)
 * @returns {object} - { isLoading, showLoading, startLoading, stopLoading }
 */
export function useSmartLoading(delay = 200, minimumDuration = 150) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const delayTimerRef = useRef(null);
  const minimumTimerRef = useRef(null);
  const loadingStartTimeRef = useRef(0);

  const startLoading = () => {
    setIsLoading(true);
    loadingStartTimeRef.current = Date.now();
    
    // Delay showing the loading indicator
    delayTimerRef.current = setTimeout(() => {
      setShowLoading(true);
      delayTimerRef.current = null;
    }, delay);
  };

  const stopLoading = () => {
    setIsLoading(false);
    
    // Clear delay timer if loading finished before delay
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
      setShowLoading(false);
      return;
    }

    // If loading indicator is visible, ensure minimum duration
    if (showLoading) {
      const elapsed = Date.now() - loadingStartTimeRef.current;
      const remainingTime = Math.max(0, minimumDuration - elapsed);
      
      if (remainingTime > 0) {
        minimumTimerRef.current = setTimeout(() => {
          setShowLoading(false);
          minimumTimerRef.current = null;
        }, remainingTime);
      } else {
        setShowLoading(false);
      }
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      if (minimumTimerRef.current) {
        clearTimeout(minimumTimerRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading
  };
}
