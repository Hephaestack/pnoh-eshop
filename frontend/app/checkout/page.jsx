import { redirect } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

async function fetchCurrentUser() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const res = await fetch(`${apiUrl}/auth/me`, { cache: 'no-store', credentials: 'include' })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    return null
  }
}

export default async function CheckoutPage() {
  const user = await fetchCurrentUser()

  if (!user || !user.user_id) {
    // Redirect unauthenticated users to sign-in (server-side)
    redirect('/auth/sign-in?redirect_url=/checkout')
  }

  return <CheckoutClient />
}
