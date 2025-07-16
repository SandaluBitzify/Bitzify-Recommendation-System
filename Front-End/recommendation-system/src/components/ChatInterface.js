import { useState, useRef, useEffect, useCallback } from "react"
import RecommendationCards from "./RecommendationCards"
import "./ChatInterface.css"

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your Bitzify consultant. How can I help you find the perfect addons for your business today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true)

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setTranscript("")
      }

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setInputMessage((prev) => prev + finalTranscript)
          setTranscript("")
        } else {
          setTranscript(interimTranscript)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        setTranscript("")
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setTranscript("")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

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

  const startListening = useCallback(() => {
    if (recognitionRef.current && speechSupported && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      }
    }
  }, [speechSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

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
              value={inputMessage + (transcript ? ` ${transcript}` : "")}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening... Speak now!" : "Ask me about addon recommendations..."}
              className={`chat-input ${isListening ? "listening" : ""}`}
              rows="1"
              disabled={isLoading}
            />

            {speechSupported && (
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={`voice-button ${isListening ? "listening" : ""}`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                <span className="voice-icon">{isListening ? "🔴" : "🎤"}</span>
                {isListening && (
                  <div className="voice-animation">
                    <div className="pulse-ring"></div>
                    <div className="pulse-ring delay-1"></div>
                    <div className="pulse-ring delay-2"></div>
                  </div>
                )}
              </button>
            )}

            <button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} className="send-button">
              <span className="send-icon">📤</span>
            </button>
          </div>
          {isListening && (
            <div className="voice-status">
              <div className="voice-status-content">
                <span className="voice-status-icon">🎤</span>
                <span className="voice-status-text">{transcript ? `"${transcript}"` : "Listening... Speak now!"}</span>
                <button onClick={stopListening} className="stop-voice-button">
                  Stop
                </button>
              </div>
            </div>
          )}
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
