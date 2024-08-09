import api from "@/api/api"
import { ICreateUser, IUser } from "@/models/user.model"
import { AxiosResponse } from "axios"

export const findByDocument = async (document: string): Promise<AxiosResponse> => {
  try {
    const res = await api.get(`users/doc/${document}`)
    return res
  } catch (error: any) {
    return error
  }
}

export const findById = async (id: string): Promise<AxiosResponse> => {
  try {
    const res = await api.get(`users/${id}`)
    return res
  } catch (error: any) {
    return error
  }
}

export const findAllUsers = async (): Promise<AxiosResponse> => {
  try {
    const res = await api.get("users")
    return res
  } catch (error: any) {
    return error
  }
}

export const addUsers = async (body: ICreateUser): Promise<AxiosResponse> => {
  try {
    const res = await api.post("users/add", body)
    return res
  } catch (error: any) {
    return error
  }
}

export const updateUsers = async (id: string, body: Omit<IUser, | "_id" | "id" | "createdAt" | "updatedAt">): Promise<AxiosResponse> => {
  try {
    // console.log("hello token", api.defaults.headers.common['Authorization'])
    console.log("body", body)
    const res = await api.put(`users/${id}`, body, { headers: { Authorization: api.defaults.headers.common['Authorization'] } })
    return res
  } catch (error: any) {
    return error
  }
}

export const deleteUsers = async (id: string): Promise<AxiosResponse> => {
  try {
    const res = await api.delete(`users/${id}`, { headers: { Authorization: api.defaults.headers.common['Authorization'] } })
    return res
  } catch (error: any) {
    return error
  }
}
