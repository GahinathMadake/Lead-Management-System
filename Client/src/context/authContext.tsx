// src/context/UserContext.tsx
import { type Response } from "@/Interfaces/Response"
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch user on mount
  const fetchUser = async () => {
    try {
      setLoading(true)
      const res = await axios.get<Response>(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        withCredentials: true,
      });

      if(res.data.success === false) {
        setUser(null)
        return
      }

      setUser(res.data.data as User)
    } catch (err) {
      console.error("Failed to fetch user:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    const res = await axios.post<Response>(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, 
      {},
      {withCredentials: true}
    );

    if(res.data.success === false) {
      toast.success(res.data.message || "Logout failed");
      throw new Error(res.data.message || "Logout failed")
    }
    else{
        setUser(null);
        toast.success("Logged out successfully");
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}


// Hook for consuming context
export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
