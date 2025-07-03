import { useState } from "react"
import "./TopNavbar.css"

const TopNavbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e)
    }
  }

  return (
    <div className="top-navbar">
      <div className="navbar-content">
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for add-ons (e.g., Financial Management)"
                className="search-input"
              />
              <button type="submit" className="search-button">
                <span className="search-icon">🔍</span>
              </button>
            </div>
          </form>
        </div>

        <div className="navbar-actions">
          <div className="notification-icon">
            <span>🔔</span>
            <div className="notification-badge">3</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
