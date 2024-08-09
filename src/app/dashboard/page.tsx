import React from 'react'
import { NavBar } from '../components/nav-bar'
import { UsersTable } from './components/users-table';
import { AssistanceTable } from './components/assistance-table';

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-2 items-center justify-start w-full h-screen bg-background" suppressHydrationWarning>
      <div className="flex w-full h-fit items-center">
        <NavBar />
      </div>
      <div className='flex flex-col items-center mt-11 justify-center gap-4 w-full h-full px-10'>
        <UsersTable />
        <AssistanceTable />
      </div>
    </div>
  )
}


