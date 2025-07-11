import { useState, useRef, useEffect } from "react"
import RecommendationCards from "./RecommendationCards"
import "./ChatInterface.css"

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your MYOB Acumatica addon consultant. How can I help you find the perfect addons for your business today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: data.response,
        timestamp: new Date(),
        recommendations: data.recommended_addons || [],
      }

      setMessages((prev) => [...prev, botMessage])
      setRecommendations(data.recommended_addons || [])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <h2>💬 AI Addon Consultant</h2>
          <p>Get personalized addon recommendations through conversation</p>
        </div>
        <div className="chat-status">
          <div className="status-indicator online"></div>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.content}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="message-recommendations">
                    <RecommendationCards recommendations={message.recommendations} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about addon recommendations..."
              className="chat-input"
              rows="1"
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} className="send-button">
              <span className="send-icon">📤</span>
            </button>
          </div>
          <div className="input-suggestions">
            <button
              onClick={() => setInputMessage("I use inventory management a lot. What addons do you suggest?")}
              className="suggestion-chip"
            >
              Inventory suggestions
            </button>
            <button
              onClick={() => setInputMessage("What are the best financial management addons?")}
              className="suggestion-chip"
            >
              Financial addons
            </button>
            <button
              onClick={() => setInputMessage("I need help with project management. Any recommendations?")}
              className="suggestion-chip"
            >
              Project management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
