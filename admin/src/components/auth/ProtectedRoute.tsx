"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

type ProtectedRouteProps = {
  allowedRoles?: string[]
}

const ProtectedRoute = ({ allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading, hasRole } = useAuth()

  // If authentication is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If roles specified but user doesn't have required role
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4 text-center">You don't have the necessary permissions to access this page.</p>
        <button onClick={() => window.history.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    )
  }

  // If authenticated and has role or no role specified, render the children
  return <Outlet />
}

export default ProtectedRoute
