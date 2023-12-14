// CartItemCounterWrapper.tsx
'use client';

import { useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { CartItemsContext } from '@/providers/CartItemsProvider';

interface CartItemCounterWrapperProps {
  productId: string;
  children: ReactNode;
}

export default function CartItemCounterWrapper({ productId, children }: CartItemCounterWrapperProps) {
  const { data: session } = useSession({ required: true });
  const { cartItems, updateCartItems } = useContext(CartItemsContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(
          `/api/users/${session!.user._id}/cart`,
          {
            method: 'GET',
          }
        );

        if (res.ok) {
          const body = await res.json();
          updateCartItems(body.cartItems);
        }
      } catch (error) {
        console.error('Error getting the cart', error);
      }
    };

    fetchCart();
  }, [session, updateCartItems]);

  return <div>{children}</div>;
}