type UserRole = "admin" | "manager" | "staff"

export type userRequestData = {
    userId: string,
    name: string,
    role: UserRole
    businessName: string,
    businessId: string
}

export type AuthContextType = {
    user: userRequestData | null
    login: ( user: userRequestData ) => void
    logout: () => void
}