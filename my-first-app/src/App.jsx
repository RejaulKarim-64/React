import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Welcome from './components/Welcome'

function App() {
  const [userEmail, setUserEmail] = useState('')

  const handleLogin = (email) => {
    setUserEmail(email)
  }

  const handleSignOut = () => {
    setUserEmail('')
  }

  return userEmail ? (
    <Welcome email={userEmail} onSignOut={handleSignOut} />
  ) : (
    <Login onLogin={handleLogin} />
  )
}

export default App
