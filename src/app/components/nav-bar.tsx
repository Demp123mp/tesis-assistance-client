"use client";

import React from 'react';
import { ThemeSwitch } from '../../components/custom/theme-switch';
import LogoutButton from './button-logout';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/user/user.store';

export const NavBar = () => {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const isAuthPage = () => {
    return ['/auth'].includes(pathname) || ['/'].includes(pathname);
  };

  return (
    <div className='flex flex-row items-center justify-between w-full px-10 py-3 border-b'>
     <div className="gap-2 flex items-center">
        <span className="text-2xl text-white font-bold bg-blue-600 dark:bg-blue-700/80 py-1 px-2 rounded-lg">
          Assist
        </span>
        <span className="text-2xl hidden sm:inline">
          Control
        </span>
      </div>
      
      <div className='flex items-center gap-4'>
        <span className='text-lg font-semibold'>{user ? `${user.firstname} ${user.lastname[0]}.` : ""}</span>
        <ThemeSwitch />
        {!isAuthPage() && <LogoutButton />}
      </div>
    </div>
  );
};
