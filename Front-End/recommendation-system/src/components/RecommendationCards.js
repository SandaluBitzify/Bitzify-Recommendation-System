import "./RecommendationCards.css"

const RecommendationCards = ({ recommendations }) => {
  const getCardClass = (alreadyInstalled) => {
    if (alreadyInstalled === 1) return "card-installed"
    if (alreadyInstalled === 0) return "card-not-installed"
    if (alreadyInstalled === "acumatica suggested") return "card-suggested"
    return "card-default"
  }

  const getStatusText = (alreadyInstalled) => {
    if (alreadyInstalled === 1) return "Installed"
    if (alreadyInstalled === 0) return "Not Installed"
    if (alreadyInstalled === "acumatica suggested") return "Acumatica Suggested"
    return "Unknown"
  }

  const getStatusIcon = (alreadyInstalled) => {
    if (alreadyInstalled === 1) return "✅"
    if (alreadyInstalled === 0) return "❌"
    if (alreadyInstalled === "acumatica suggested") return "💡"
    return "❓"
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="no-recommendations">
        <div className="no-recommendations-icon">🔍</div>
        <h3>No recommendations found</h3>
        <p>Try searching for an add-on to get personalized recommendations</p>
      </div>
    )
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-grid">
        {recommendations.map((item, index) => (
          <div key={index} className={`recommendation-card ${getCardClass(item.already_installed)}`}>
            <div className="card-header">
              <div className="card-icon">{getStatusIcon(item.already_installed)}</div>
              <div className="card-status">
                <span className="status-text">{getStatusText(item.already_installed)}</span>
              </div>
            </div>

            <div className="card-content">
              <h3 className="addon-name">{item.addon}</h3>
              <p className="addon-description">Enhance your Acumatica experience with this powerful add-on</p>
            </div>

            <div className="card-footer">
              <button className="card-action-button">
                {item.already_installed === 1
                  ? "View Details"
                  : item.already_installed === 0
                    ? "Install Now"
                    : "Learn More"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationCards
