'use client' 

import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react"

export const navbarButtonClasses =
  'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';

interface NavbarSignOutButtonProps {
  children: ReactNode;
}

export default function NavbarSignOutButton({ children }: NavbarSignOutButtonProps) {

  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <button className={navbarButtonClasses} onClick= {handleSignOut}>
      {children}
    </button>
  );
}