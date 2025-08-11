import CustomSignIn from '@/components/auth/CustomSignIn'

export default function SignInPage({ searchParams }) {
  const redirectUrl = searchParams?.redirect_url || '/'
  
  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CustomSignIn redirectUrl={redirectUrl} />
      </div>
    </div>
  )
}
