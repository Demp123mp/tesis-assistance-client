"use client"
import { LoaderCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'


interface Props {
  size: "extralarge" | "large" | "normal" | "small"
  color?: string
}

export function Spinner({size,color}: Props) {

  const {theme} = useTheme()

  return (
    <div className='w-full h-full bg-transparent flex flex-row items-center justify-center'>
      <LoaderCircle 
        className='loader' size={size === 'large' ? 30 : size === "normal" ? 23 : size === 'small' ? 15 : 50} 
        // color={theme === "dark" ? "white" : theme === "light" ? "hsl(var(--primary))" : color ? color : "white"}
        color={color ? `${color}` : theme === "dark" ? "white" : theme === "light" ? "hsl(var(--muted))" : "white"}
      />
    </div>
  )
}
