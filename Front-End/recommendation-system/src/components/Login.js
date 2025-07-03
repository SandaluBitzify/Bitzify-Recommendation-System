import { useState } from "react"
import "./Login.css"

const Login = ({ onLogin }) => {
  const [customerNumber, setCustomerNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customerNumber.trim()) {
      setIsLoading(true)
      // Simulate loading for better UX
      setTimeout(() => {
        onLogin(customerNumber.trim())
        setIsLoading(false)
      }, 800)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <h1>Bitzify Recommendation System</h1>
          <p>Enter your customer number to access personalized recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="customerNumber">Customer Number</label>
            <input
              type="text"
              id="customerNumber"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Enter your customer number"
              required
              className="customer-input"
            />
          </div>

          <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
