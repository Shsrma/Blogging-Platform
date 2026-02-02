import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
