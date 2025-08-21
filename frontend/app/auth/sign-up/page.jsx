import CustomSignUp from '@/components/auth/CustomSignUp'

export default async function SignUpPage({ searchParams }) {
  const params = await searchParams
  const redirectUrl = params?.redirect_url || '/'

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CustomSignUp redirectUrl={redirectUrl} />
      </div>
    </div>
  )
}
