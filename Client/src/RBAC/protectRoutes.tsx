import { type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useUser } from "@/context/authContext"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useUser()

  if(!user){
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
