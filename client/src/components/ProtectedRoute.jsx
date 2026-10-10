import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  // On a page reload the session is still being restored from the token
  // (GET /auth/me) — wait for it instead of redirecting to /login.
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}
