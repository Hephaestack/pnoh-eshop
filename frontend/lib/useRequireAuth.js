import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

/**
 * Hook to enforce authentication - redirects to login if user is not authenticated
 * @param {string} redirectUrl - URL to redirect to after login (defaults to current page)
 * @returns {object} - { isLoaded, isSignedIn, user, isAuthenticating }
 */
export function useRequireAuth(redirectUrl) {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  
  useEffect(() => {
    if (isLoaded && (!isSignedIn || !user)) {
      const currentPath = redirectUrl || window.location.pathname;
      router.push(`/auth/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
    }
  }, [isLoaded, isSignedIn, user, router, redirectUrl]);

  const isAuthenticating = !isLoaded || (!isSignedIn || !user);

  return {
    isLoaded,
    isSignedIn,
    user,
    isAuthenticating
  };
}
