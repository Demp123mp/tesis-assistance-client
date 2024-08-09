import React from 'react'
import { NavBar } from '../components/nav-bar'
import Form from './components/styled-form'
import Image from 'next/image'
export default function AuthPage() {
  return (
  <div className="flex flex-col h-screen bg-background">
      <NavBar /> 
      <div className="flex-grow flex gap-32 items-center justify-center p-3">
      <div className="hidden sm:block">
        <Image 
          src="/imgLogin.png"
          width={450}
          height={250}
          alt="Picture of the author"
        />
      </div>
      <Form />
      </div>
    </div>
  )
}
