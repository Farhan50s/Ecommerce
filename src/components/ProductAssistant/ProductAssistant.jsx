import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Send, Trash2, Bot, User } from 'lucide-react';
import './ProductAssistant.css';

const QUICK_ACTIONS = [
  "What are the materials?",
  "Tell me about shipping",
  "Is this good for a gift?",
  "What is the return policy?",
  "Highlight the main features"
];

const ProductAssistant = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm your product assistant for **${product.name}**. How can I help you today?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // small delay to ensure rendering before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  // Handle Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClear = () => {
    setMessages([
      { role: 'assistant', content: `Hi! I'm your product assistant for **${product.name}**. How can I help you today?` }
    ]);
  };

  const handleSend = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    
    // reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      // Extensive System Prompt
      const systemPrompt = `You are a helpful, premium luxury concierge and product assistant for an item named "${product.name}". 
Here are the complete product details:
- Category: ${product.category}
- Price: $${product.price}
- Rating: ${product.rating || 'N/A'} stars (${product.reviewsCount || 0} reviews)
- Description: ${product.description}
- Materials/Care: Designed for durability and easy care. Spot clean recommended. Do not machine wash unless explicitly stated. Avoid prolonged exposure to harsh elements.
- Shipping/Returns: Free standard shipping on orders over $150. Returns accepted within 30 days of delivery in original unused condition.

Answer customer questions about this product ONLY. Be elegant, concise, friendly, and confident. Use markdown (e.g., bullet points, bolding) to format your responses beautifully. If you don't know something from the provided details, honestly and gracefully admit it.`;

      const conversationHistory = newMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: systemPrompt,
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I'm experiencing a momentary connection issue. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const showQuickActions = messages.length === 1;

  return (
    <div className="product-assistant-wrapper" ref={wrapperRef}>
      {!isOpen ? (
        <button 
          className="product-assistant-toggle bounce-in" 
          onClick={() => setIsOpen(true)}
          aria-label="Open Product Assistant"
        >
          <MessageSquare size={24} />
          <span className="tooltip">Ask AI</span>
        </button>
      ) : (
        <div className="product-assistant-panel slide-up">
          <div className="assistant-header">
            <div className="assistant-header-title">
               {product.media && product.media[0] ? (
                 <img src={product.media[0].url} alt={product.name} className="header-product-img" />
               ) : (
                 <Bot size={20} />
               )}
              <div className="header-text-group">
                <span className="header-title">Product AI</span>
                <span className="header-subtitle">{product.name}</span>
              </div>
            </div>
            <div className="assistant-header-actions">
              <button onClick={handleClear} className="action-btn" title="Clear Conversation">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="action-btn" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                {msg.role === 'user' ? <User size={14} className="message-icon" /> : <Bot size={14} className="message-icon" />}
                <div className="message-content">
                  {msg.role === 'assistant' ? (
                     <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                     msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble ai-message loading-message">
                <Bot size={14} className="message-icon" />
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-input-segment">
            {showQuickActions && (
              <div className="quick-actions-container fade-in">
                {QUICK_ACTIONS.map((action, i) => (
                  <button 
                    key={i} 
                    className="quick-action-chip"
                    onClick={() => handleSend(action)}
                    disabled={isLoading}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            
            <form className="assistant-input-area" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                placeholder="Ask about materials, shipping..."
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                rows={1}
              />
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!inputText.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAssistant;
