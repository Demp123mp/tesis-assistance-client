"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield } from 'lucide-react'
import { Spinner } from '@/components/custom/spinner'
import { findByDocument } from '@/api/users/users.api'
import { useRouter } from 'next/navigation'
import { addAssistance } from '@/api/assistance/assistance.api'
import { z } from 'zod'

export const AssistanceCheck = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [onValueChange, setOnValueChange] = useState<string>("")
  const [onValueSubmit, setOnValueSubmit] = useState({
    submit: false,
    error: false,
    message: ""
  })

  const router = useRouter()
  const AssistanceType = z.enum(["in", "out"])
  const handleSubmit = async (e: any, type: z.infer<typeof AssistanceType>) => {
    e.preventDefault()
    setOnValueSubmit({ submit: false, error: false, message: "" })
    setIsLoading(true)
    const { data, status } = await findByDocument(onValueChange)
    if (Object.keys(data).length !== 0) {
      console.log("pasa", data)
      await addAssistance({
        worker: data._id,
        date: new Date(),
        type
      })
      setOnValueSubmit({ submit: true, error: false, message: `Se ha registrado ${type === "in" ? "entrada" : "salida"} correctamente.` })
    } else {
      console.log("error", data)
      setOnValueSubmit({ submit: true, error: true, message: "Cedula erronea" })
    }
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center px-10 py-10 gap-8 border-2 rounded-md min-w-2/5 w-fit'>
      <Button 
        className='flex flex-row gap-2 items-center w-full justify-start' 
        variant={"link"} 
        disabled={isLoading}
        onClick={() => router.push("/auth")}
      >
        <span className='text-base font-semibold text-primary'>Panel Administrativo</span>
        <Shield size={16} color='hsl(var(--primary))'/>
      </Button>
      <span className='text-2xl font-semibold'>Ingrese su cedula de identidad</span>
      <div className='flex flex-col gap-2 items-start justify-center w-full h-fit'>
        <Input 
          placeholder='Cedula de Identidad'
          className={`py-6 text-lg border-2 ${onValueSubmit.submit && !onValueSubmit.error ? "border-green-500" : onValueSubmit.error && onValueSubmit.submit && "border-red-500"}`}
          type='number'
          disabled={isLoading}
          onChange={(e) => setOnValueChange(e.target.value)}
        />
        { onValueSubmit.submit && <span className={`${onValueSubmit.error ? "text-red-500" : "text-green-500"} text-sm`}>{ onValueSubmit.message }</span> }
      </div>
      <div className='flex flex-row gap-2 items-center justify-between w-full'>
        <Button 
          className='w-full text-xl py-7' 
          onClick={(event) => handleSubmit(event, "in")}
          disabled={ isLoading || onValueChange.length < 7 }
        >
          { isLoading ? <Spinner size='large'/> : "Entrada" }
        </Button>
        <Button 
          className='bg-red-500 hover:bg-red-500/90 w-full text-xl py-7' 
          onClick={(event) => handleSubmit(event, "out")}
          disabled={ isLoading || onValueChange.length < 7 }
        >
          { isLoading ? <Spinner size='large'/> : "Salida" }
        </Button>
      </div>
    </div>
  )
}
