import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./poll.css";
import QuorumLogo from "../assets/Quorum_logo.png";

function Poll() {
  const navigate = useNavigate();

  const initialPolls = [
    {
      id: "poll1",
      question:
        "Should the common area vending machines be stocked with healthier snack options?",
      poster: "Student Council",
      yes: 0,
      no: 0,
    },
    {
      id: "poll2",
      question:
        "Is the current Wi-Fi speed sufficient for all students' academic needs?",
      poster: "IT Department",
      yes: 0,
      no: 0,
    },
    {
      id: "poll3",
      question:
        "Do you believe class recordings should be mandatory for all core subjects?",
      poster: "Academic Senate",
      yes: 0,
      no: 0,
    },
  ];

  const [polls, setPolls] = useState(initialPolls);
  const [userVotes, setUserVotes] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const handleVote = (pollId, voteType) => {
    if (userVotes[pollId]) return;

    const updatedPolls = polls.map((poll) =>
      poll.id === pollId ? { ...poll, [voteType]: poll[voteType] + 1 } : poll
    );

    setPolls(updatedPolls);
    setUserVotes({ ...userVotes, [pollId]: voteType });
  };

  const handleAddPoll = () => {
    if (showForm) return;
    setShowForm(true);
  };

  const handleSavePoll = () => {
    if (newQuestion.trim().length < 10) {
      alert("Poll question must be at least 10 characters long.");
      return;
    }

    const newPoll = {
      id: `poll-${Date.now()}`,
      question: newQuestion,
      poster: "Community Member",
      yes: 0,
      no: 0,
    };

    setPolls([...polls, newPoll]);
    setNewQuestion("");
    setShowForm(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
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
          <a href="/PostPage"><span className="nav-icon icon-feed"></span> Feed</a>
          <a href="/ProfilePage"><span className="nav-icon icon-profile"></span> Profile</a>
          <a href="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</a>
          <a href="/Events" className="active"><span className="nav-icon icon-events"></span> Events</a>
          <a href="/poll"><span className="nav-icon icon-polls"></span> Polls</a>
          <a href="/Hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</a>
     </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search Quorum..."
          />
        </div>
      </div>

      {/* ================= POLL CONTENT ================= */}
      <main className="poll-main-content">
        <h2>Campus Opinion Polls</h2>

        {polls.map((poll) => (
          <div
            key={poll.id}
            className={`poll-card ${
              userVotes[poll.id] ? `voted-${userVotes[poll.id]}` : ""
            }`}
          >
            <div className="poll-question">{poll.question}</div>
            <div className="poll-meta">
              Posted by: {poll.poster} |{" "}
              <span className="response-count-container">
                Yes: <span className="response-count-yes">{poll.yes}</span> No:{" "}
                <span className="response-count-no">{poll.no}</span>
              </span>
            </div>

            <div className="vote-options">
              <button
                className="vote-btn yes-btn"
                onClick={() => handleVote(poll.id, "yes")}
              >
                Yes
              </button>
              <button
                className="vote-btn no-btn"
                onClick={() => handleVote(poll.id, "no")}
              >
                No
              </button>
            </div>

            <div className="vote-message">
              {userVotes[poll.id]
                ? `You voted: ${userVotes[poll.id].toUpperCase()}`
                : ""}
            </div>
          </div>
        ))}

        {showForm && (
          <div id="createPollForm" className="poll-card">
            <div className="poll-question">Create New Poll:</div>
            <textarea
              id="newPollQuestion"
              rows="3"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              placeholder="Enter your poll question here..."
            ></textarea>
            <button
              id="savePollBtn"
              style={{
                padding: "10px 15px",
                background: "var(--primary-red)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleSavePoll}
            >
              Save Poll
            </button>
          </div>
        )}
      </main>

      {/* ================= ADD POLL BUTTON ================= */}
      <button id="addPollBtn" className="add-poll-btn" onClick={handleAddPoll}>
        +
      </button>

      {/* ================= FOOTER ================= */}
      <div className="footer">
        <p>Quorum - Campus Social Network © 2025 | Terms | Privacy | About</p>
      </div>
    </>
  );
}

export default Poll;
