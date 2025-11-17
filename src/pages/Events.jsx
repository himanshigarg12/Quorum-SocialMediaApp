import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // import Link + useNavigate
import "./Events.css";
import QuorumLogo from "../assets/Quorum_logo.png";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // initialize navigate

  useEffect(() => {
    console.log("Events page loaded");
    const storedEvents = JSON.parse(localStorage.getItem("eventsList") || "[]");
    console.log("Events found in localStorage:", storedEvents);
    setEvents(storedEvents);
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Navbar */}
      <input type="checkbox" id="mobile-menu-toggle" style={{ display: "none" }} />

      <div className="navbar">
        <div className="logo-container">
          <img className="logo-img" src={QuorumLogo} alt="Quorum Logo" />
          <h1>Quorum</h1>
        </div>

        <div className="nav-menu">
          <Link to="/PostPage"><span className="nav-icon icon-feed"></span> Feed</Link>
          <Link to="/ProfilePage"><span className="nav-icon icon-profile"></span> Profile</Link>
          <Link to="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</Link>
          <Link to="/Events" className="active"><span className="nav-icon icon-events"></span> Events</Link>
          <Link to="/poll"><span className="nav-icon icon-polls"></span> poll</Link>
          <Link to="/Hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</Link>
        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search Quorum..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <label htmlFor="mobile-menu-toggle" className="mobile-menu-btn">☰</label>
      </div>

      <div className="mobile-menu-expanded">
        <Link to="/PostPage"><span className="nav-icon icon-feed"></span> Feed</Link>
        <Link to="/CreateProfile"><span className="nav-icon icon-profile"></span> Profile</Link>
        <Link to="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</Link>
        <Link to="/Events" className="active"><span className="nav-icon icon-events"></span> Events</Link>
        <Link to="/poll"><span className="nav-icon icon-polls"></span> Polls</Link>
        <Link to="/Hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</Link>
      </div>

      {/* Main Section */}
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h2>University Events</h2>
            <p className="muted">
              Browse campus events and create your own. Hackathons are managed separately and are not listed here.
            </p>
          </div>

          {/* Create New Event Button */}
          <section className="create-event-section">
            <button className="create-btn" onClick={() => navigate("/CreateEvent")}>
              + Create New Event
            </button>
          </section>

          {/* Events Display */}
          <section className="events-section" aria-live="polite">
            <div className="events-grid" id="eventsGrid">
              {filteredEvents.length === 0 ? (
                <p style={{ padding: "1rem" }}>
                  No events found. Create a new event to see it here.
                </p>
              ) : (
                filteredEvents.map((event, index) => {
                  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div className="event-card" key={index} data-type={event.type}>
                      <div className="event-header">
                        <span className={`event-type ${event.type}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        <span className="event-date">{formattedDate}</span>
                      </div>

                      <h3 className="event-title">{event.title}</h3>
                      {event.description && <p className="event-description">{event.description}</p>}

                      <div className="event-details">
                        {event.location && (
                          <div className="detail">
                            <span className="icon">📍</span>
                            {event.location}
                          </div>
                        )}
                        {event.time && (
                          <div className="detail">
                            <span className="icon">⏰</span>
                            {event.time}
                          </div>
                        )}
                        {event.maxParticipants && (
                          <div className="detail">
                            <span className="icon">👥</span>
                            Max: {event.maxParticipants}
                          </div>
                        )}
                        {event.registrationDeadline && (
                          <div className="detail">
                            <span className="icon">⏳</span>
                            Register by: {event.registrationDeadline}
                          </div>
                        )}
                        {event.googleForm && (
                          <div className="detail">
                            <span className="icon">📝</span>
                            <a href={event.googleForm} target="_blank" rel="noreferrer">
                              Form Link
                            </a>
                          </div>
                        )}
                      </div>

                      {event.poster && (
                        <img
                          src={event.poster}
                          alt="Poster"
                          style={{
                            maxWidth: "100%",
                            marginBottom: "1rem",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Events;
