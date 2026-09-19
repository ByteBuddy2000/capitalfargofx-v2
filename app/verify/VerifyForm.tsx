// app/verify/VerifyForm.tsx
'use client'
import Logo from '@/components/Logo/Logo'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const VerifyEmail = () => {

  const params = useSearchParams();
  const email = params.get('email');
  const error = params.get("error")

  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='z-1 w-full rounded-xl bg-white p-6 shadow-md sm:max-w-md'>
        <div className='mb-6'>
          <Logo />

          <div>

            <h1 className='mb-1.5 text-2xl font-bold'>Verify your email</h1>
            {error === "invalid" && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                This verification link is invalid or has expired.
              </div>
            )}
            <p className='text-base text-slate-600'>
              An activation link has been sent to your email address: <b>{email}</b>. Please check your inbox/spam and
              click on the link to complete the registration process.
            </p>
          </div>
        </div>

        <div>
          <div className='flex justify-center space-y-4'>
            {/* <Button className='w-full' >
              <Link href='/login'>Sign In</Link>
            </Button> */}

            <Button className='w-fit mx-auto text-gray-500 text-center'>
              Didn&apos;t get the mail ? {' '}
              <Link href='#' className='text-card-foreground hover:underline'>
                Resend
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
