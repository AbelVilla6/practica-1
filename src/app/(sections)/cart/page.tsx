import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCartByUserId } from '@/lib/handlers';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';

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
      {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Product name
                </th>
                <th scope="col" className="px-4 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3">
                  Price
                </th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItemsData.cartItems.map((cartItem) => (
                <tr key={cartItem.product._id.toString()} className="border-b dark:border-gray-700 bg-gray-50">
                  <td
                    scope="row"
                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Link href={`/products/${cartItem.product._id}`}>
                      {cartItem.product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className='flex items-center'>
                      <button className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md mr-1">-</button>
                      <span className="bg-gray-200 px-2 py-1 rounded-md">
                        {cartItem.qty}
                      </span>
                      <button className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md ml-1">+</button>
                      <button className="text-gray-500 bg-red-200 px-2 py-1 rounded-md ml-1">
                        <TrashIcon className='h-5 w-5' aria-hidden='true' />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">{cartItem.product.price} €</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{(cartItem.qty * cartItem.product.price).toFixed(2)} €</td>
                </tr>
              ))}
              <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Total
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {cartItemsData.cartItems.reduce((total, cartItem) => total + cartItem.qty * cartItem.product.price, 0).toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
              <button className="bg-black text-white px-4 py-2 rounded-md">
                <Link href="/checkout">
                  Check Out
                </Link>
              </button>
          </div>
        </> 
      )}
    </div>
  );
}