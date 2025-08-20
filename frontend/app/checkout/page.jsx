import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage() {
  const { userId } = auth()

  if (!userId) {
    // Redirect unauthenticated users to sign-in (server-side)
    redirect('/auth/sign-in?redirect_url=/checkout')
  }

  return <CheckoutClient />
}
