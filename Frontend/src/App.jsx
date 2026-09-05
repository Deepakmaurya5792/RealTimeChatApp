import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import useAuthStore from './zustand/useAuthStore'
import useSocketStore from './zustand/useSocketStore'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

function App() {
  const authUser = useAuthStore((state) => state.authUser)
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    if (authUser) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [authUser, connectSocket, disconnectSocket]);

  return (
    <div className='min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center overflow-hidden antialiased'>
      <Routes>
        <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
    </div>
  )
}

export default App