import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { notFound, redirect } from 'next/navigation';
import { Session } from 'next-auth';
import { CartResponse, getCartByUserId } from '@/lib/handlers';
import { OrdersResponse, getOrdersByUserId } from '@/lib/handlers';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function Checkout() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  const cartItemsData: CartResponse | null = await getCartByUserId(
    session.user._id
  );

  const orderData = await getOrdersByUserId(
    session.user._id
  );

  if (!cartItemsData || cartItemsData.cartItems === null) {
    notFound();
  }

  if (!orderData || orderData.orders === null) {
    notFound();
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Checkout
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
        <div className="relative overflow-x-auto">
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
                <th scope="col" className="px-4 py-3">
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
                        <div className="ml-5">{cartItem.qty}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{cartItem.product.price} €</td>
                  <td className="px-4 py-3">{(cartItem.qty * cartItem.product.price).toFixed(2)} €</td>
                </tr>
              ))}
              <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Total
                </td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3">
                  {cartItemsData.cartItems.reduce((total, cartItem) => total + cartItem.qty * cartItem.product.price, 0).toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Shipping Address</h2>
            <div className="border rounded p-2 mt-2 bg-white">
                <p className="text-sm text-gray-400 dark:text-gray-300">{orderData.orders[0].address}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row">
            {/* Primer par */}
            <div className="w-full sm:w-1/2 mr-4">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Card Holder</h2>
                <div className="border rounded p-2 mt-2 bg-white">
                <p className="text-sm text-gray-400 dark:text-gray-300">{orderData.orders[0].cardHolder}</p>
                </div>
            </div>

            {/* Segundo par */}
            <div className="w-full sm:w-1/2">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Card Number</h2>
                <div className="border rounded p-2 mt-2 bg-white">
                <p className="text-sm text-gray-400 dark:text-gray-300">{orderData.orders[0].cardNumber}</p>
                </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
              <button className="bg-gray-300 text-white px-5 py-3 rounded-md">
                  Purchase
              </button>
          </div>
        </> 
      )}
    </div>
  );
}