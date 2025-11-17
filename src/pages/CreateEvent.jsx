import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateEvent.css";
import QuorumLogo from "../assets/Quorum_logo.png";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    registrationDeadline: "",
    googleForm: "",
    description: "",
  });

  const [posterPreview, setPosterPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPosterPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Event Title is required");
      return;
    }

    const storedEvents = JSON.parse(localStorage.getItem("eventsList") || "[]");
    const newEvent = { ...formData, id: Date.now(), poster: posterPreview };

    storedEvents.push(newEvent);
    localStorage.setItem("eventsList", JSON.stringify(storedEvents));

    alert("Event Created Successfully!");
    navigate("/Events");
  };

  return (
    <div>
      {/* NAVBAR */}
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
          <Link to="/poll"><span className="nav-icon icon-polls"></span> Polls</Link>
          <Link to="/Hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</Link>
        </div>
      </div>

      {/* MAIN FORM SECTION */}
      <main className="main">
        <div className="form-wrapper">   {/* <-- Added wrapper for centering */}

          <div className="page-header">
            <h2>Create a New Event</h2>
            <p>Fill in the details below. Hackathons are managed separately.</p>
          </div>

          <form className="create-form" onSubmit={handleSubmit}>
            <h3>Event Details</h3>

            <div className="form-group">
              <label>Event Title</label>
              <input type="text" name="title" placeholder="e.g., AI Ethics Seminar" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Event Type</label>
              <select name="type" required onChange={handleChange}>
                <option value="">Select type</option>
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" placeholder="e.g., Auditorium Hall" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Max Participants</label>
              <input type="number" name="maxParticipants" placeholder="e.g., 100" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Registration Deadline</label>
              <input type="date" name="registrationDeadline" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Google Form</label>
              <input type="text" name="googleForm" placeholder="Paste form link here" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Write about your event..." onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Upload Poster</label>
              <input type="file" accept="image/*" onChange={handlePosterUpload} />
            </div>

            {posterPreview && <img src={posterPreview} className="poster-preview" alt="Poster Preview" />}

            <div className="form-actions">
              <button type="submit" className="btn-primary">Create Event</button>
              <button type="button" className="btn-secondary" onClick={() => navigate("/Events")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
