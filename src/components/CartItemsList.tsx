'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useContext } from 'react';
import Link from 'next/link';
import CartItemCounter from "@/components/CartItemCounter";
import { CartItemsContext } from '@/providers/CartItemsProvider';
import { CartResponse } from '@/lib/handlers';
import { check } from 'prettier';

export default function CartItemList() {
    const { data: session } = useSession({ required: true });
    const { cartItems, updateCartItems } = useContext(CartItemsContext);
    
    useEffect(() => {
      const fetchCart = async () => {
        try {
          const res = await fetch(
            `/api/users/${session!.user._id}/cart`,
            {
              method: 'GET',
              // body: JSON.stringify({cartItems}),
            }
          ); 
          const body = await res.json();
  
          if (res.ok) {            
            updateCartItems(body.cartItems);
          }
        } catch (error) {
          console.error('Error getting cart:', error);
        }
      };
  
      fetchCart();
    }, [updateCartItems]);

    return (
      <div>
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
                        <CartItemCounter productId={cartItem.product._id.toString()}/>
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
                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                  <Link href={`/checkout`}>
                      Checkout
                  </Link>
                </button>                 
              </div>
            </> 
          )}
      </div>
    )
}