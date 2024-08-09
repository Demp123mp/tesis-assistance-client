"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { z } from "zod";
import { Spinner } from "./spinner";

const endpoint = z.enum(["contacts", "products"])
type IEndpoint = z.infer<typeof endpoint>;

interface Cols {
  key: string,
  header: string
}
interface Props {
  endpoint: IEndpoint,
  cols: Cols[]
  refetch: () => Promise<void>
}

export default function CustomFileInput({endpoint, cols, refetch}: Props) {

  const [file, setFile] = useState<File | null>()
  const [fileError, setFileError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const onSendFile = async () => {
    setIsLoading(true)
    if(!file) {
      setFileError(true)
      setIsLoading(false)
      return
    }

    if (file) {
        const form = new FormData()
        form.set('file', file)
        form.set('cols', JSON.stringify(cols))
  
        return await fetch("/api/xlsx", {
          method: "PUT",
          body: form
        }).then((data) => data.json())
          .then(async data => {
              console.log("carga masiva", data)
            setIsLoading(false)
            return data
          }).catch((err) => {
            setIsLoading(false)
            return err
          })
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-5 px-5 py-5">
      <h2 className="text-medium">Carga de Contactos</h2>
      <div className="flex flex-col items-center justify-between gap-2 py-2 border-2 border-dashed dark:border-muted border-muted rounded-md">
        <Input
          type="file"
          onChange={(e) => {
            const fileList = e.target.files && e.target.files["0"]
            setFileError(false)
            setFile(fileList)
          }}
          className="border-0 flex items-center text-red-300 font-bold"
        />
        {/* <span className={`${fileError ? "text-red-500" : "text-transparent"} text-xs font-medium`}>¡Debe seleccionar un archivo!</span> */}
        <Button onClick={() => onSendFile()} variant="outline" className="text-primary dark:text-white">
          {
            isLoading ? <Spinner size="small"/> : "Subir Archivo"
          }
        </Button>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 w-full rounded-lg px-3 py-3  border-2 border-dashed border-muted text-sm">
        <ul className="list-disc list-inside">
          <li>El archivo debe ser un XLSX</li>
          <li>El archivo no debe exceder los 5MB</li>
          <li>El archivo debe regirse por la plantilla proporcionada</li>
        </ul>
        <Button variant="outline" className="text-primary dark:text-white">Descargar Plantilla</Button>
      </div>
    </div>
  )
}

