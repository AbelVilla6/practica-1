'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/handlers';
import Users, { User } from '@/models/User';


interface FormValues {
  name: string; 
  surname: string;
  email: string;
  password: string;
  address: string;
  birthdate: Date | null;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    birthdate: null,
  });

  const handleSubmit = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
        const data = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
        });
  
        if (data.ok) {
        //   const body = await data.json();
        //   createUser(body.formValues);
          router.push('/');
        } else {
          setError('There is already an account with that email');
        }
    } catch (error) {
        setError('Error processing the request. Try again later.');
    }

    // const User = await Users.find({ email: formValues.email });
    // if (User.length !== 0) {
    //   setError('A user with this email already exists');
    //   return;
    // }
    // if (!event.currentTarget.checkValidity()) {
    //   return false;
    // }
    // const hash = await bcrypt.hash(formValues.password, 10);

    // const newUser = await Users.create({
    //     name: formValues.name,
    //     surname: formValues.surname,
    //     email: formValues.email,
    //     password: hash,
    //     address: formValues.address,
    //     birthdate: formValues.birthdate,
    //     cartItems: [],
    //     orders: [],
    //   });

  };

  return (
    <form className='group space-y-6' onSubmit={handleSubmit} noValidate>
      <div>
        <label
          htmlFor='name'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Name
        </label>
        <input
          id='name'
          name='name'
          type='text'
          autoComplete='name'
          placeholder='John'
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              name: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid name.
        </p>
      </div>
      <div>
        <label
          htmlFor='surname'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Surname
        </label>
        <input
          id='surname'
          name='surname'
          type='text'
          autoComplete='surname'
          placeholder='Doe'
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.surname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              surname: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid surname.
        </p>
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          E-mail address
        </label>
        <input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          placeholder='mami@example.com'
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              email: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid email address.
        </p>
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          placeholder=' '
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              password: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please input your password.
        </p>
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Address
        </label>
        <input
          id='address'
          name='address'
          type='address'
          autoComplete='address'
          placeholder='Empty Street 123, 12345 EmptyCity,EmptyLand'
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              address: e.target.value,
            }))
          }
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid address.
        </p>
      </div>

      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Birthdate
        </label>
        <input
          id='birthdate'
          name='birthdate'
          type='date'
          autoComplete='birthdate'
        //   placeholder='Empty Street 123, 12345 EmptyCity,EmptyLand'
          required
          className='peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500'
          value={formValues.birthdate ? formValues.birthdate.toISOString().split('T')[0] : ''}
          //   value={formValues.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              birthdate: new Date(e.target.value),
            }))
          }
        />
        {formValues.birthdate !== null && (
          <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
            Please provide a valid date.
          </p>
        )}
      </div>

      {error &&
        <div className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 ring-1 ring-inset ring-red-500'>
          <p className='text-sm text-gray-900'>
            {error}
          </p>
        </div>
      }

      <div>
        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30'
        >
          Sign up
        </button>
      </div>
    </form>
  );
}