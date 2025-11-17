import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./chat.css";
import Logo from "../assets/Quorum_logo.png";

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const name = params.get("name") || "Unknown User";

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(name);
    if (saved) return JSON.parse(saved);

    const defaults = [
      { sender: "received", text: "Hey there!" },
      { sender: "sent", text: "Hi! How’s everything?" }
    ];

    localStorage.setItem(name, JSON.stringify(defaults));
    return defaults;
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessages = (list) => {
    setMessages(list);
    localStorage.setItem(name, JSON.stringify(list));
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const updated = [...messages, { sender: "sent", text: input }];
    saveMessages(updated);
    setInput("");

    const replies = [
      "Got it 👍",
      "Thanks for the info!",
      "Okay, noted.",
      "Sounds good!",
      "I'll get back to you.",
      "Understood.",
      "Alright!",
      "Great, thanks!"
    ];

    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      saveMessages([...updated, { sender: "received", text: reply }]);
    }, 1200);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-window">

      <div className="chat-header">
        <div className="header-left">
          <div className="logo-wrapper">
            <img src={Logo} alt="App Logo" className="logo-icon" />
          </div>
        </div>

        <div className="header-center">
          <div className="profile-group">
            <div className="avatar">{initials}</div>
            <h2 className="profile-link">{name}</h2>
          </div>
        </div>

        <div className="header-right">
          <button className="back-btn" onClick={() => navigate("/chatscroll")}>
            &#x2329;
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <div className="bubble">
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
        />
        <button className="emoji-btn">&#128515;</button>
        <button className="send-btn" onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
}

export default Chat;
