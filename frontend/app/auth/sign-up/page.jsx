import CustomSignUp from '@/components/auth/CustomSignUp'

export default function SignUpPage({ searchParams }) {
  const redirectUrl = searchParams?.redirect_url || '/'
  
  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CustomSignUp redirectUrl={redirectUrl} />
      </div>
    </div>
  )
}
