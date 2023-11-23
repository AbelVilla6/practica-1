import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCartByUserId } from '@/lib/handlers';
import CartItemsList from "@/components/CartItemsList";

export const dynamic = 'force-dynamic';

export default async function Cart() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartResponse | null = await getCartByUserId(
    session.user._id
  );

  if (!cartItemsData || cartItemsData.cartItems === null) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-900 dark:text-gray-300">The cart is empty.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      <CartItemsList />
    </div>
  );
}