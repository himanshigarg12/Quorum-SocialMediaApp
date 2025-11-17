import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateHackathon.css";
import QuorumLogo from "../assets/Quorum_logo.png";

const CreateHackathon = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    registrationUrl: "",
    contact: "",
    startDateTime: "",
    endDateTime: "",
    venue: "",
    teamMin: "1",
    teamMax: "4",
    categories: "",
    description: "",
    flyer: "",
    googleForm: "",
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, flyer: reader.result });
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      title,
      organizer,
      registrationUrl,
      contact,
      startDateTime,
      endDateTime,
      venue,
      teamMin,
      teamMax,
      categories,
      description,
      flyer,
    } = formData;

    if (!title || !organizer || !contact || !startDateTime || !endDateTime || !venue || !description) {
      alert("❌ Please fill in all required fields");
      return;
    }

    if (new Date(startDateTime) >= new Date(endDateTime)) {
      alert("❌ End date/time must be after start date/time");
      return;
    }

    if (parseInt(teamMin) > parseInt(teamMax)) {
      alert("❌ Minimum team size cannot be greater than maximum team size");
      return;
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);
    const durationMs = endDate - startDate;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationText =
      durationHours >= 24
        ? `${Math.floor(durationHours / 24)} day${Math.floor(durationHours / 24) > 1 ? "s" : ""}`
        : `${durationHours} hour${durationHours > 1 ? "s" : ""}`;

    const hackathon = {
      id: Date.now().toString(),
      title,
      organizer,
      registrationUrl,
      contact,
      startDate: startDateTime,
      endDate: endDateTime,
      venue,
      teamMin: parseInt(teamMin),
      teamMax: parseInt(teamMax),
      teamSize:
        teamMin === teamMax
          ? `${teamMin} member${teamMin > 1 ? "s" : ""}`
          : `${teamMin}-${teamMax} members`,
      duration: durationText,
      categories: categories ? categories.split(",").map((c) => c.trim()) : [],
      description,
      flyer,
      googleForm: registrationUrl,
      createdAt: new Date().toISOString(),
      participants: 0,
    };

    const existing = JSON.parse(localStorage.getItem("Hackathons") || "[]");
    existing.unshift(hackathon);
    localStorage.setItem("hackathonsList", JSON.stringify(existing));

    alert("✅ Hackathon created successfully!");
    navigate("/Hackathons");
  };

  return (
    <div className="create-hackathon-page">
      {/* Navbar */}
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
          <a href="/poll"><span className="nav-icon icon-polls"></span> Polls</a>
          <a href="/Hackathons" className="active"><span className="nav-icon icon-hackathon"></span> Hackathon</a>
        </div>
      </div>

      {/* Form Area */}
      <main className="hackathon-main">
        <div className="form-wrapper">
          <form className="hackathon-form" onSubmit={handleSubmit}>
            <h1>Create Hackathon</h1>
            <p>Fill the details below. Flyer upload is supported.</p>

            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., HACK•AI 2025" required />

            <label>Organizer</label>
            <input name="organizer" value={formData.organizer} onChange={handleChange} placeholder="Quorum Dev Club" required />

            <label>Registration Link (optional)</label>
            <input name="registrationUrl" value={formData.registrationUrl} onChange={handleChange} placeholder="https://…" />

            <label>Contact Email</label>
            <input name="contact" type="email" value={formData.contact} onChange={handleChange} placeholder="team@quorum.edu" required />

            <label>Start Date & Time</label>
            <input name="startDateTime" type="datetime-local" value={formData.startDateTime} onChange={handleChange} required />

            <label>End Date & Time</label>
            <input name="endDateTime" type="datetime-local" value={formData.endDateTime} onChange={handleChange} required />

            <label>Venue</label>
            <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Innovation Lab" required />

            <label>Min Team Size</label>
            <select name="teamMin" value={formData.teamMin} onChange={handleChange}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Max Team Size</label>
            <select name="teamMax" value={formData.teamMax} onChange={handleChange}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            <label>Tracks / Themes</label>
            <input name="categories" value={formData.categories} onChange={handleChange} placeholder="AI, FinTech, Civic" />

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe goals, evaluation, and rules." required />

            <label>Flyer (Poster)</label>
            <input name="flyer" type="file" accept="image/*" onChange={handleChange} />

            <label>Google Form Link (optional)</label>
            <input name="googleForm" type="url" onChange={handleChange} placeholder="https://forms.gle/your-form-link" />

            <div className="actions">
              <button type="button" className="btn outline" onClick={() => navigate("/Hackathons")}>
                Cancel
              </button>
              <button type="submit" className="btn">
                Create Hackathon
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateHackathon;