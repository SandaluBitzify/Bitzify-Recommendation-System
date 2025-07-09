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

  // Extract addon name from the full addon string
  const extractAddonName = (fullAddonString) => {
    const parts = fullAddonString.split(": ")
    return parts.length > 1 ? parts[1].trim() : fullAddonString.trim()
  }

  // Extract category from the full addon string
  const extractCategory = (fullAddonString) => {
    const parts = fullAddonString.split(": ")
    return parts.length > 1 ? parts[0].trim() : "General"
  }

  // Get logo path for addon - Updated to use public folder
  const getAddonLogo = (fullAddonString) => {
    const addonName = extractAddonName(fullAddonString)
    // Use public folder path - React serves static files from public folder
    return `/logos/${addonName}.png`
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

  const renderSection = (title, addons, sectionClass) => {
    if (addons.length === 0) return null

    return (
      <div className={`recommendation-section ${sectionClass}`}>
        <div className="section-header">
          <h3 className="section-title">{title}</h3>
          <span className="section-count">{addons.length} add-ons</span>
        </div>
        <div className="recommendations-grid">
          {addons.map((item, index) => {
            const addonName = extractAddonName(item.addon)
            const category = extractCategory(item.addon)
            const logoPath = getAddonLogo(item.addon)

            // Debug logging
            console.log(`Addon: ${item.addon}`)
            console.log(`Extracted name: ${addonName}`)
            console.log(`Category: ${category}`)
            console.log(`Logo path: ${logoPath}`)
            console.log(`Status: ${item.already_installed}`)

            return (
              <div key={index} className={`recommendation-card ${getCardClass(item.already_installed)}`}>
                <div className="card-header">
                  <div className="addon-logo-container">
                    <img
                      src={logoPath || "/placeholder.svg"}
                      alt={`${addonName} logo`}
                      className="addon-logo"
                      onLoad={(e) => {
                        console.log(`Logo loaded successfully: ${logoPath}`)
                        e.target.style.display = "block"
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "none"
                        }
                      }}
                      onError={(e) => {
                        console.log(`Logo failed to load: ${logoPath}`)
                        e.target.style.display = "none"
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "flex"
                        }
                      }}
                    />
                    <div className="addon-logo-fallback">{getStatusIcon(item.already_installed)}</div>
                  </div>
                  <div className="card-status">
                    <span className="status-text">{getStatusText(item.already_installed)}</span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="addon-category">{category}</div>
                  <h3 className="addon-name">{addonName}</h3>
                  <p className="addon-description">
                    {item.already_installed === "acumatica suggested"
                      ? "Curated recommendation from Acumatica experts for your business needs"
                      : "Enhance your business operations with this powerful add-on solution"}
                  </p>
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
            )
          })}
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
