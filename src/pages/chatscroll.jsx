import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./chatscroll.css";
import QuorumLogo from "../assets/Quorum_logo.png";

function ChatScroll() {
  const navigate = useNavigate();

  const [chats, setChats] = useState([
    { name: "Kavya Kapoor", img: "/kavya.png", time: "2hr ago" },
    { name: "Nidhi Sachdeva", img: "/nidhi.png", time: "6hr ago" },
    { name: "Ananya Patel", img: "/ananya.png", time: "2d ago" },
    { name: "Vikram Kumar", img: "/vikram.png", time: "3d ago" },
    { name: "Sanjay Mehta", img: "/sanjay.png", time: "5d ago" },
    { name: "Riya Sharma", img: "/riya.png", time: "6d ago" },
    { name: "Kaira", img: "/kaira.png", time: "6d ago" },
  ]);

  const [trends, setTrends] = useState([
    "#QuorumTech – 1248 posts",
    "#CampusLife – 892 posts",
    "#StudyGroup – 567 posts",
    "#UniversityEvents – 423 posts",
    "#QuorumSports – 345 posts",
  ]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTrends((prev) => {
        const updated = [...prev];
        const index = Math.floor(Math.random() * updated.length);
        const base = updated[index].split("–")[0];
        updated[index] = `${base}– ${Math.floor(Math.random() * 2000) + 200} posts`;
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFollow = (e) => {
    const btn = e.target;
    if (btn.textContent === "Follow") {
      btn.textContent = "Following";
      btn.style.background = "#6c757d";
    } else {
      btn.textContent = "Follow";
      btn.style.background = "var(--primary-red)";
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div
          className="logo-container"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img className="logo" src={QuorumLogo} alt="Quorum Logo" />
          <h1>Quorum</h1>
        </div>

        <div className="nav-menu">
          <a href="/postpage"><span className="nav-icon icon-feed"></span> Feed</a>
          <a href="/profilepage"><span className="nav-icon icon-profile"></span> Profile</a>
          <a href="/chatscroll" className="active"><span className="nav-icon icon-chat"></span> Chat</a>
          <a href="/events"><span className="nav-icon icon-events"></span> Events</a>
          <a href="/poll"><span className="nav-icon icon-polls"></span> Polls</a>
          <a href="/hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</a>
        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search Quorum..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="container">
        <div className="main-chat-content">
          <div className="chat-list-container">
            {filteredChats.map((chat) => (
              <div
                key={chat.name}
                className="chat-card"
                onClick={() => navigate(`/chat?name=${encodeURIComponent(chat.name)}`)}
              >
                <div className="chat-left">
                  <img src={chat.img} alt={chat.name} className="avatar" />
                  <div className="chat-details">
                    <span className="chat-name">{chat.name}</span>
                  </div>
                </div>
                <div className="chat-time">{chat.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Trending at Quorum</h3>
            <ul className="trending">
              {trends.map((trend, i) => (
                <li key={i}>{trend}</li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Who to follow</h3>
            {[
              { name: "Kaira", username: "@kairaaa", img: "/kaira.png" },
              { name: "Vikram Kumar", username: "@vikramkumar", img: "/vikram.png" },
              { name: "Ananya Patel", username: "@ananyapatel", img: "/ananya.png" },
            ].map((user) => (
              <div className="follow-suggest" key={user.name}>
                <div>
                  <img src={user.img} alt={user.name} />
                  <div className="user-info">
                    <span>{user.name}</span>
                    <span>{user.username}</span>
                  </div>
                </div>
                <button onClick={handleFollow}>Follow</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Quorum - Campus Social Network © 2025 | Terms | Privacy | About</p>
      </div>
    </>
  );
}

export default ChatScroll;
