import SignInForm from '@/components/SignUpForm';
import Link from 'next/link';

export default function SignUp() {
  return (
    <div className='flex w-full flex-col px-6 py-12'>
      <div className='mx-auto w-full max-w-sm'>
        <img
          className='mx-auto h-10 w-auto'
          src='/img/logo.png'
          alt='e-Shop logo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Sign up with a new account
        </h2>
      </div>

      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignInForm /> 

        <p className='mt-10 text-center text-sm text-gray-500'>
            Are you already a member?{' '}    
          <Link
            href='/auth/signin'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Sign in in your acount
          </Link>
        </p>
      </div>
    </div>
  );
}