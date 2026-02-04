import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Welcome from './components/Welcome'

function App() {
  const [userEmail, setUserEmail] = useState('')

  const handleLogin = (email) => {
    setUserEmail(email)
  }

  return userEmail ? (
    <Welcome email={userEmail} />
  ) : (
    <Login onLogin={handleLogin} />
  )
}

export default App
