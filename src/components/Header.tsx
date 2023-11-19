export default function Header() {
  return (
    <header className='mx-auto w-full bg-gray-800 px-4 pb-8 pt-12 text-center sm:pb-10 sm:pt-16 lg:px-6 lg:pb-12 lg:pt-18'>
      <div className='mx-auto max-w-md'>
        <h1 className='text-3xl font-bold text-gray-100 sm:text-4xl lg:text-5xl'>
          e-Phone
        </h1>
        <p className='mt-2 text-xs leading-5 text-gray-400 sm:mt-2 sm:text-sm lg:text-base'>
          The e-commerce created by experts for citizens
        </p>
      </div>
    </header>
  );
}
