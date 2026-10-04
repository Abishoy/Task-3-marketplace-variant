import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Listings from './pages/Listings.jsx'
import ListingForm from './pages/ListingForm.jsx'
import { useAuth } from './hooks/useAuth.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="container">
      <nav className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-semibold">Campus Marketplace</Link>
          <Link to="/listings" className="text-sm">Listings</Link>
          {user && <Link to="/listings/new" className="text-sm">Sell an Item</Link>}
        </div>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm">Logged in as <b>{user.name}</b></span>
              <button onClick={logout} className="btn">Logout</button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/listings" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/new" element={
          <ProtectedRoute><ListingForm /></ProtectedRoute>
        } />
        <Route path="/listings/:id" element={
          <ProtectedRoute><ListingForm /></ProtectedRoute>
        } />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  )
}
