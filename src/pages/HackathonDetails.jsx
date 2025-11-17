import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HackathonDetails.css";
import QuorumLogo from "../assets/Quorum_logo.png";

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);

  useEffect(() => {
    const storedHackathons = JSON.parse(localStorage.getItem("hackathonsList") || "[]");
    const foundHackathon = storedHackathons.find((h) => h.id === id);
    if (!foundHackathon) {
      alert("Hackathon not found!");
      navigate("/Hackathons");
    } else {
      setHackathon(foundHackathon);
      document.title = `${foundHackathon.title} • Quorum`;
    }
  }, [id, navigate]);

  if (!hackathon) return null;

  // Format date and time
  const start = new Date(hackathon.startDate);
  const end = new Date(hackathon.endDate);
  const formattedDateRange = `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString(
    "en-US",
    { month: "short" }
  )}`;
  const formattedStartTime = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedEndTime = end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="hackathon-details-page">
      {/* ✅ Navbar */}
      <div className="navbar">
        <div className="logo-container">
          <img className="logo" src={QuorumLogo} alt="Quorum Logo" />
          <h1>Quorum</h1>
        </div>

        <div className="nav-menu">
          <a href="/PostPage"><span className="nav-icon icon-feed"></span> Feed</a>
          <a href="/ProfilePage"><span className="nav-icon icon-profile"></span> Profile</a>
          <a href="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</a>
          <a href="/Events"><span className="nav-icon icon-events"></span> Events</a>
          <a href="/poll"><span className="nav-icon icon-polls"></span> poll</a>
          <a href="/Hackathons" className="active"><span className="nav-icon icon-hackathon"></span> Hackathon</a>
        </div>
      </div>

      {/* ✅ Main Content */}
      <main className="container space">
        <article className="card">
          <div className="section">
            <h1 className="h1">{hackathon.title}</h1>
            <div className="meta">
              <span className="chip">{formattedDateRange}</span>
              <span className="chip">{hackathon.venue}</span>
              <span className="chip">{hackathon.teamSize}</span>
              <span className="chip">{hackathon.duration}</span>
            </div>

            <div className="actions">
              {hackathon.googleForm ? (
                <a
                  className="btn"
                  href={hackathon.googleForm}
                  target="_blank"
                  rel="noreferrer"
                >
                  Register Now
                </a>
              ) : null}
              <button className="btn-outline" onClick={() => navigate("/Hackathons")}>
                Back to List
              </button>
            </div>
          </div>

          <div className="section">
            <h2 className="h2">About</h2>
            <p className="muted">{hackathon.description}</p>
          </div>

          {hackathon.categories && hackathon.categories.length > 0 && (
            <div className="section">
              <h2 className="h2">Tracks & Themes</h2>
              <ul>
                {hackathon.categories.map((cat, idx) => (
                  <li key={idx}>{cat}</li>
                ))}
              </ul>
            </div>
          )}

          {(hackathon.organizer || hackathon.contact) && (
            <div className="section">
              <h2 className="h2">Contact Info</h2>
              {hackathon.organizer && (
                <p>
                  <strong>Organizer:</strong> {hackathon.organizer}
                </p>
              )}
              {hackathon.contact && (
                <p>
                  <strong>Contact:</strong> {hackathon.contact}
                </p>
              )}
            </div>
          )}

          {hackathon.flyer && (
            <div className="section">
              <h2 className="h2">Event Flyer</h2>
              <img
                src={hackathon.flyer}
                alt={`${hackathon.title} Flyer`}
                className="flyer-img"
              />
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default HackathonDetails;