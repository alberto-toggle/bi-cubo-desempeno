"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Loader2 } from "lucide-react";

const AIMessageBar = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (responseTimer.current) clearTimeout(responseTimer.current);
    },
    [],
  );

  // Simulate AI typing effect
  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);

    // Simulate different responses based on input
    let response = "Hi there! I'm your AI assistant. How can I help you today?";

    if (
      userMessage.toLowerCase().includes("hello") ||
      userMessage.toLowerCase().includes("hi")
    ) {
      response =
        "Hello! I'm your friendly AI assistant. What can I do for you?";
    } else if (userMessage.toLowerCase().includes("help")) {
      response =
        "I'm here to help! You can ask me questions, request information, or just chat.";
    } else if (userMessage.toLowerCase().includes("thank")) {
      response = "You're welcome! Is there anything else you'd like to know?";
    } else if (userMessage.toLowerCase().includes("who are you")) {
      response =
        "I'm an AI assistant designed to be helpful, harmless, and honest!";
    }

    responseTimer.current = setTimeout(() => {
      responseTimer.current = null;
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    }, 1500); // Delay for typing effect
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (input.trim() === "" || isTyping) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setInput("");

    simulateResponse(userMessage);
  };

  const clearChat = () => {
    if (responseTimer.current) clearTimeout(responseTimer.current);
    responseTimer.current = null;
    setIsTyping(false);
    setMessages([]);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement?.parentElement;
    if (container)
      container.scrollTo({
        top: container.scrollHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [messages, isTyping]);

  return (
    <div className="coderislive-assistant w-full max-w-xl mx-auto flex flex-col h-[600px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl overflow-hidden shadow-2xl border border-indigo-500/20">
      {/* Header */}
      <div className="bg-indigo-600/30 backdrop-blur-sm p-4 border-b border-indigo-500/30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-indigo-300 h-5 w-5" />
          <h2 className="text-white font-medium">AI Assistant</h2>
        </div>
        <button
          type="button"
          aria-label="Clear conversation"
          onClick={clearChat}
          className="text-indigo-200 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages container */}
      <div
        className="p-4 min-h-0 flex-1 overflow-y-auto bg-slate-900/50"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-indigo-200 text-xl mb-2">
              How can I help you today?
            </h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Try this demo with local, predefined responses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.isUser
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-700/60 text-slate-100 rounded-tl-none border border-slate-600/50"
                  } animate-coderislive-message-in`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl bg-slate-700/60 text-slate-100 rounded-tl-none border border-slate-600/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse coderislive-delay-one"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse coderislive-delay-two"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className={`p-4 border-t ${isFocused ? "border-indigo-500/70 bg-slate-800/80" : "border-slate-700/50 bg-slate-800/30"} transition-colors duration-200`}
      >
        <div className="relative flex items-center">
          <input
            aria-label="Message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type your message..."
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-full py-3 pl-4 pr-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
          <button
            aria-label="Send message"
            type="submit"
            disabled={input.trim() === "" || isTyping}
            className={`absolute right-1 rounded-full p-2 ${
              input.trim() === ""
                ? "text-slate-500 bg-slate-700/50 cursor-not-allowed"
                : "text-white bg-indigo-600 hover:bg-indigo-500"
            } transition-colors`}
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      <style>
        {`
        @media (prefers-reduced-motion: reduce) { .coderislive-assistant * { animation: none !important; } }
        @keyframes coderislive-message-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-coderislive-message-in {
          animation: coderislive-message-in 0.3s ease-out forwards;
        }

        .coderislive-delay-one {
          animation-delay: 0.2s;
        }

        .coderislive-delay-two {
          animation-delay: 0.4s;
        }
        `}
      </style>
    </div>
  );
};

export default AIMessageBar;
