import api from "@/api/api"

import { ICreateAssistant } from "@/models/assistance.model"
import { AxiosResponse } from "axios"

export const findAllAssistance = async (): Promise<AxiosResponse> => {
  try {
    const res = await api.get("/assistance")
    return res
  } catch (error: any) {
    return error
  }
}

export const addAssistance = async (data: ICreateAssistant) => {
  try {
    const res = await api.post("/assistance/add", data)
    return res
  } catch (error) {
    return error
  }
}

export const deleteAssistance = async (id: string) => {
  try {
    const res = await api.delete(`/assistance/${id}`)
    return res
  } catch (error) {
    return error
  }
}

export const updateAssistance = async (id: string, data: ICreateAssistant) => {
  try {
    const res = await api.put(`/assistance/${id}`, data)
    return res
  } catch (error) {
    return error
  }
}
