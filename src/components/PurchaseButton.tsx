'use client';

import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/handlers';
import Users, { User } from '@/models/User';


interface FormValues {
  address: string; 
  cardHolder: string;
  cardNumber: string;
}

export default function PurchaseForm() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    address: '',
    cardHolder: '',
    cardNumber: '',
  });

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
        const data = await fetch(`/api/users/${session!.user._id}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
  
        if (data.ok) {
          const newOrder = await data.json();
        //   const body = await data.json();
        //   createUser(body.formValues);
          router.push(`/orders/${newOrder._id}`);
        } else {
            const errorResponse = await data.json(); // Intenta obtener detalles del error
            setError(errorResponse.message || 'Please, complete all the data to make a purchase');
        //   setError('There is probably an error with the order data');
        }
    } catch (error) {
        setError('Error processing the request. Try again later.');
    }
  };

  return (
    <form className='group space-y-6' onSubmit={handleSubmit} noValidate>
      <div className="mt-6 flex-col sm:flex-row">
        <label
          htmlFor='address'
          className='text-sm font-semibold text-gray-900 dark:text-white' 
        >
          Shipping Address
        </label>
        <div className="border rounded p-2 mt-2 bg-white flex">
        <input
          id='address'
          name='address'
          type='text'
          autoComplete='address'
          placeholder='Unnamed Street 123, 12345 London,UK'
          required
          className='peer flex-1 text-sm text-gray-400 dark:text-gray-300 shadow-sm placeholder:text-gray-400  sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              address: e.target.value,
            }))
          }
        />
        </div>
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid address.
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 mr-4">
            <label
            htmlFor='cardHolder'
            className="text-sm font-semibold text-gray-900 dark:text-white"
            >
            Card Holder
            </label>
            <div className="border rounded p-2 mt-2 bg-white flex">
            <input
            id='cardHolder'
            name='cardHolder'
            type='text'
            autoComplete='cardHolcer'
            placeholder='John Doe'
            required
            className='peer flex-1 text-sm text-gray-400 dark:text-gray-300 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
            value={formValues.cardHolder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prevFormValues) => ({
                ...prevFormValues,
                cardHolder: e.target.value,
                }))
            }
            />
            </div>
            <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid Card Holder.
            </p>
        </div>
        <div className="w-full sm:w-1/2 mr-4">
            <label
            htmlFor='cardHolder'
            className="text-sm font-semibold text-gray-900 dark:text-white"
            >
            Card Number
            </label>
            <div className="border rounded p-2 mt-2 bg-white flex">
            <input
            id='cardNumber'
            name='cardNumber'
            type='cardNumber'
            autoComplete='cardNumber'
            placeholder='0000111122223333'
            required
            className='peer flex-1 text-sm text-gray-400 dark:text-gray-300 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
            value={formValues.cardNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prevFormValues) => ({
                ...prevFormValues,
                cardNumber: e.target.value,
                }))
            }
            />
            </div>
            <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid Card Number.
            </p>
        </div>
      </div>

      {error &&
        <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
          <p className='text-sm text-gray-900'>
            {error}
          </p>
        </div>
      }

      <div className="flex justify-center mt-8">
        <button
          type='submit'
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          Purchase
        </button>
      </div>
    </form>
  );
}