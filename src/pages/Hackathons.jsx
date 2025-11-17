import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Hackathons.css";
import QuorumLogo from "../assets/Quorum_logo.png";

const Hackathons = () => {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("hackathonsList") || "[]") || [];
      const valid = stored.filter(h => h && h.startDate);
      const sorted = valid.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setHackathons(sorted);
      console.log("Loaded hackathons:", sorted);
    } catch (error) {
      console.error("Error loading hackathons:", error);
      setHackathons([]);
    }
  }, []);

  const filteredHackathons = hackathons.filter((hack) => {
    const q = searchTerm.toLowerCase();
    return hack?.title?.toLowerCase()?.includes(q) || hack?.venue?.toLowerCase()?.includes(q);
  });

  const deleteHackathon = (id) => {
    if (window.confirm("Are you sure you want to delete this hackathon?")) {
      const updated = hackathons.filter((h) => h.id !== id);
      localStorage.setItem("hackathonsList", JSON.stringify(updated));
      setHackathons(updated);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="logo-container">
          <img className="logo" src={QuorumLogo} alt="Quorum Logo" />
          <h1>Quorum</h1>
        </div>

        <div className="nav-menu">
          <Link to="/postpage"><span className="nav-icon icon-feed"></span> Feed</Link>
          <Link to="/profilepage"><span className="nav-icon icon-profile"></span> Profile</Link>
          <Link to="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</Link>
          <Link to="/events"><span className="nav-icon icon-events"></span> Events</Link>
          <Link to="/poll"><span className="nav-icon icon-polls"></span> Polls</Link>
          <Link to="/hackathons" className="active"><span className="nav-icon icon-hackathon"></span> Hackathon</Link>
        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search hackathons..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <main className="hackathons-main">
        <div className="hackathon-wrapper">
          <h1 className="h1">Hackathons</h1>
          <p className="muted">Discover campus hackathons and build teams.</p>

          <div className="actions">
            <button className="btn" onClick={() => navigate("/CreateHackathon")}>
              + Create Hackathon
            </button>
            <button className="btn-outline">Upcoming</button>
          </div>

          <section id="upcoming" className="grid">
            {filteredHackathons.length === 0 ? (
              <p className="empty-text">No hackathons found. Create your first hackathon!</p>
            ) : (
              filteredHackathons.map((hack) => (
                <article className="card" key={hack.id}>
                  <h2 className="card-title">{hack.title}</h2>
                  <div className="meta">
                    <dt>Team Size</dt>
                    <dd>{hack.teamSize || "N/A"}</dd>
                    <dt>Duration</dt>
                    <dd>{hack.duration || "N/A"}</dd>
                    <dt>Date</dt>
                    <dd>
                      {new Date(hack.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                    <dt>Venue</dt>
                    <dd>{hack.venue || "TBA"}</dd>
                  </div>

                  <div className="card-actions">
                    <button className="btn-outline" onClick={() => navigate(`/hackathon/${hack.id}`)}>
                      View Details
                    </button>
                    {hack.googleForm && (
                      <a className="btn" href={hack.googleForm} target="_blank" rel="noreferrer">
                        Register
                      </a>
                    )}
                    <button className="btn-delete" onClick={() => deleteHackathon(hack.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Hackathons;
