'use client';

import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CartItemsContext } from '@/providers/CartItemsProvider';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItemCounterProps {
    productId: string;
}
export default function CartItemCounter({
    productId,
    }: CartItemCounterProps) {
        const { data: session } = useSession({ required: true });
        const { cartItems, updateCartItems } = useContext(CartItemsContext);
        const [isUpdating, setIsUpdating] = useState(false);
        
        const cartItem = cartItems.find((cartItem) => 
          cartItem.product._id === productId
        );
        const qty = cartItem ? cartItem.qty : 0;

        const onPlusBtnClick = async function (event: React.MouseEvent) {
            setIsUpdating(true);
          
            try {
              const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                  method: 'PUT',
                  body: JSON.stringify({
                    qty: qty + 1,
                  }),
                }
              );
          
              if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
              }
            } finally {
              setIsUpdating(false);
            }
          };

          const onLessBtnClick = async function (event: React.MouseEvent) {

            if (qty <= 1) {
              return;
            }
            setIsUpdating(true);
          
            try {
              const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                  method: 'PUT',
                  body: JSON.stringify({
                    qty: qty - 1,
                  }),
                }
              );
          
              if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
              }
            } finally {
              setIsUpdating(false);
            }
          };

          const onDeleteBtnClick = async function (event: React.MouseEvent) {
            setIsUpdating(true);
          
            try {
              const res = await fetch(
                `/api/users/${session!.user._id}/cart/${productId}`,
                {
                  method: 'Delete',
                  body: JSON.stringify({cartItems}),
                }
              );
          
              if (res.ok) {
                const body = await res.json();
                updateCartItems(body.cartItems);
              }
            } finally {
              setIsUpdating(false);
            }
          };

        return (
            <div className='flex items-center'>
                <button onClick={onLessBtnClick} className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md mr-1" disabled={!session || isUpdating}>-</button>
                <span className="bg-gray-200 px-2 py-1 rounded-md">
                {qty}
                </span>
                <button onClick={onPlusBtnClick} className="text-gray-500 bg-gray-300 px-2 py-1 rounded-md ml-1" disabled={!session || isUpdating}>+</button>
                <button onClick={onDeleteBtnClick} className="text-gray-500 bg-red-200 px-2 py-1 rounded-md ml-1" disabled={!session || isUpdating}>
                    <TrashIcon className='h-5 w-5' aria-hidden='true' />
                </button>
            </div>
        )
}