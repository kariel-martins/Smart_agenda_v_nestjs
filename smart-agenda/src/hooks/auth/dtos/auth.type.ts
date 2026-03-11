export type registerDTO = {
    name: string,
    nameBusiness: string,
    email: string,
    password: string,
    confirmPassword: string
}

export type loginDTO = {
    email: string,
    password: string,
}

type UserRole = "admin" | "manager" | "staff"

export type authResponce = {
id: string
  BusinessName: string
  slug: string | null
  phone: string | null
  email: string
  timezone: string
  createdAt: Date
  user: {
  name: string
  email: string
  userRole: UserRole
  createdAt: Date
  updatedAt: Date | null
  }

  refreshToken: string
    accessToken: string
} 