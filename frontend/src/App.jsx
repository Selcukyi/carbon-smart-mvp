import { RouterProvider } from 'react-router-dom'
import { router } from './routes.jsx'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-primary">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  )
}

export default App
