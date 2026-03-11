import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react"
import type { AuthContextType, userRequestData } from "./dtos/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: {children: ReactNode}) {
    const [user, setUser] = useState<userRequestData | null>(null)
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (newUser: userRequestData) => {
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
    }

    const logout = () => {
         localStorage.removeItem("user");
  window.location.href = "/signIn"; // TODO - deve mexer na logicar para a api chamar logout
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function UseAuth() {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error("useAuth deve ser usado dentro do AuthProvider")
    }
    return context
}