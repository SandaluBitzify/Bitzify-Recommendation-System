import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import TopNavbar from "./TopNavbar"
import RecommendationCards from "./RecommendationCards"
import "./Dashboard.css"

const Dashboard = ({ customerNumber, addonName, companyName, companySize, onLogout }) => {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)

      try {
        console.log("Sending request to API:", {
          customer_number: Number.parseInt(customerNumber),
          selected_addon: addonName,
        })

        const response = await fetch("http://127.0.0.1:5000/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_number: Number.parseInt(customerNumber),
            selected_addon: addonName,
          }),
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data)

        setRecommendations(data.recommended_addons || [])
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        alert(
          `Error fetching recommendations: ${error.message}. Please check if the backend is running on http://127.0.0.1:5000`,
        )
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [customerNumber, addonName])

  return (
    <div className="dashboard">
      <Sidebar
        customerNumber={customerNumber}
        companyName={companyName}
        companySize={companySize}
        onLogout={onLogout}
      />
      <div className="main-content">
        <TopNavbar />
        <div className="content-area">
          <div className="content-header">
            <h2>Add-on Recommendations</h2>
            <p className="search-info">
              Showing recommendations for: <span className="highlight">{addonName}</span>
            </p>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading recommendations...</p>
            </div>
          ) : (
            <RecommendationCards recommendations={recommendations} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
