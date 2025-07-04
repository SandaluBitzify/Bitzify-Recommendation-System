import "./TopNavbar.css"

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="navbar-content">
        <div className="navbar-title">
          <h2>MYOB Add-on Recommendations</h2>
          <p>Discover the perfect add-ons for your business needs</p>
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
