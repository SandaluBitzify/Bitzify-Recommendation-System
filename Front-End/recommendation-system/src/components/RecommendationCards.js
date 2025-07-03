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

  // Filter recommendations into sections
  const installedAddons = recommendations.filter((item) => item.already_installed === 1)
  const notInstalledAddons = recommendations.filter((item) => item.already_installed === 0)
  const suggestedAddons = recommendations.filter((item) => item.already_installed === "acumatica suggested")

  const renderSection = (title, addons, sectionClass, emptyMessage) => {
    if (addons.length === 0) return null

    return (
      <div className={`recommendation-section ${sectionClass}`}>
        <div className="section-header">
          <h3 className="section-title">{title}</h3>
          <span className="section-count">{addons.length} add-ons</span>
        </div>
        <div className="recommendations-grid">
          {addons.map((item, index) => (
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

  return (
    <div className="recommendations-container">
      {renderSection("✅ Installed Add-ons", installedAddons, "installed-section")}
      {renderSection("❌ Available Add-ons", notInstalledAddons, "not-installed-section")}
      {renderSection("💡 Acumatica Recommended", suggestedAddons, "suggested-section")}
    </div>
  )
}

export default RecommendationCards
