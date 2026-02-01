import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetails from './pages/PostDetails'
import './App.css'

function App() {
  const isAuthenticated = !!localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
