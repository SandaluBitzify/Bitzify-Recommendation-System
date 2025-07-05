import { useState } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({})

  const handleLogin = (data) => {
    setLoginData(data)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginData({})
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard
          customerNumber={loginData.customerNumber}
          addonName={loginData.addonName}
          companyName={loginData.companyName}
          companySize={loginData.companySize}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
