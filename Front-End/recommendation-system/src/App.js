import { useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [customerNumber, setCustomerNumber] = useState("")

  const handleLogin = (custNumber) => {
    setCustomerNumber(custNumber)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCustomerNumber("")
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard customerNumber={customerNumber} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
