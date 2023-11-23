'use client';

import { useContext } from 'react';
import Link from 'next/link';
import CartItemCounter from "@/components/CartItemCounter";
import { CartItemsContext } from '@/providers/CartItemsProvider';
import { getCartByUserId } from '@/lib/handlers';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartItemList() {
    const { cartItems, updateCartItems } = useContext(CartItemsContext);

    {cartItems.length === 0 ? (
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
              {cartItems.map((cartItem) => (
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
                  {cartItems.reduce((total, cartItem) => total + cartItem.qty * cartItem.product.price, 0).toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
          <div className="flex justify-center mt-6">
              <button className="bg-black text-white px-4 py-2 rounded-md">
                <Link href="/checkout">
                  Check Out
                </Link>
              </button>
          </div>
        </> 
      )}
}