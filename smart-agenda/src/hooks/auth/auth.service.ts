import { axiosInstance } from "@/lib/axios";
import type { authResponce, loginDTO, registerDTO } from "./dtos/auth.type";

export async function signupService(data: registerDTO) {
  const result = await axiosInstance.post('/auth/signup', data)

  return result.data
}

export async function signinService(data: loginDTO) {
  const result = await axiosInstance.post<authResponce>('/auth/signin', data)

  return result.data
}