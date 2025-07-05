import "./Sidebar.css"

const Sidebar = ({ customerNumber, companyName, companySize, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src="/logo.png"
          alt="MYOB Logo"
          className="logo"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=60&width=150"
          }}
        />
      </div>

      <div className="sidebar-content">
        <div className="user-info">
          <div className="user-avatar">
            <span>{customerNumber.charAt(0)}</span>
          </div>
          <div className="user-details">
            <h3>{companyName || "Customer"}</h3>
            <p>#{customerNumber}</p>
            {companySize && <span className="company-size">{companySize}</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">🏠</span>
              <span>Dashboard</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📊</span>
              <span>Analytics</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">📋</span>
              <span>Reports</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
