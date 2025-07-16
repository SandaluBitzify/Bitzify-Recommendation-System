import { useState } from "react"
import "./Login.css"

const Login = ({ onLogin }) => {
  const [customerNumber, setCustomerNumber] = useState("")
  const [addonName, setAddonName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (customerNumber.trim() && addonName.trim()) {
      setIsLoading(true)
      // Simulate loading for better UX
      setTimeout(() => {
        onLogin({
          customerNumber: customerNumber.trim(),
          addonName: addonName.trim(),
          companyName: companyName.trim(),
          companySize: companySize.trim(),
        })
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
          <p>Enter your details to access personalized add-on recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="customerNumber">Customer Number *</label>
            <input
              type="text"
              id="customerNumber"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="Enter your customer number"
              required
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="addonName">Add-on Interest *</label>
            <input
              type="text"
              id="addonName"
              value={addonName}
              onChange={(e) => setAddonName(e.target.value)}
              placeholder="e.g., Financial Management, Inventory"
              required
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="companySize">Company Size</label>
            <select
              id="companySize"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="form-input form-select"
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
          </div>

          <button
            type="submit"
            className={`login-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || !customerNumber.trim() || !addonName.trim()}
          >
            {isLoading ? <div className="spinner"></div> : "Get Recommendations"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
