import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProfile.css";
import logo from "../assets/Quorum_logo.png";

function CreateProfile() {
  const [selectedInterests, setSelectedInterests] = useState([]);
const [profileImageBase64, setProfileImageBase64] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const bioTextarea = document.getElementById("bio");
    const charCountDisplay = document.querySelector(".char-count");
    const usernameCheckbox = document.getElementById("username-check");
    const progressDiv = document.querySelector(".progress");

    // ----- PROFILE IMAGE VARIABLES -----
    let profileImageBase64 = null;
    const profilePicInput = document.getElementById("profile-pic-input");
    const profileImgContainer = document.querySelector(".profile-img");
    const profilePreviewImg = document.getElementById("profile-preview-img");
    const cameraIcon = document.querySelector(".camera-icon");

    // ----- UPDATE PROGRESS FUNCTION -----
    function updateProgress() {
      const totalSteps = 6;
      let completedSteps = 0;

      if (profileImageBase64) completedSteps++;

      const fullnameInput = document.getElementById("fullname");
      if (fullnameInput && fullnameInput.value.trim() !== "") completedSteps++;

      const usernameInput = document.getElementById("username");
      if (usernameInput && usernameInput.value.trim() !== "" && usernameCheckbox.checked)
        completedSteps++;

      const departmentSelect = document.getElementById("department");
      if (departmentSelect && departmentSelect.value !== "") completedSteps++;

      if (bioTextarea && bioTextarea.value.trim() !== "") completedSteps++;

      if (document.querySelectorAll(".interest-checkbox:checked").length > 0)
        completedSteps++;

      const progressPercentage = Math.min(100, (completedSteps / totalSteps) * 100);
      progressDiv.style.width = `${progressPercentage}%`;
    }

    // ----- PROFILE PICTURE UPLOAD -----
    if (profilePicInput && profilePreviewImg) {
      profilePicInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            setProfileImageBase64(e.target.result);
profilePreviewImg.src = e.target.result;

            profilePreviewImg.style.display = "block";
            profileImgContainer.classList.add("uploaded");
            if (cameraIcon) cameraIcon.style.display = "none";
            updateProgress();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // ----- BIO INPUT LISTENER -----
    if (bioTextarea) {
      bioTextarea.addEventListener("input", () => {
        const currentLength = bioTextarea.value.length;
        charCountDisplay.textContent = `${currentLength}/${bioTextarea.getAttribute("maxlength")}`;
        updateProgress();
      });
    }

    // ----- FIELD LISTENERS -----
    document.getElementById("fullname").addEventListener("input", updateProgress);
    document.getElementById("username").addEventListener("input", updateProgress);
    document.getElementById("username-check").addEventListener("change", updateProgress);
    document.getElementById("department").addEventListener("change", updateProgress);

    document.querySelectorAll(".interest-checkbox").forEach(cb =>
      cb.addEventListener("change", updateProgress)
    );

  }, [selectedInterests]);

  // ----- INTEREST SELECTION -----
  const handleInterestChange = (e) => {
    const { value, checked } = e.target;

    if (checked && selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, value]);
    } else if (!checked) {
      setSelectedInterests(selectedInterests.filter((item) => item !== value));
    }
  };

  // ----- SUBMIT PROFILE -----
  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const department = document.getElementById("department").value;
    const bio = document.getElementById("bio").value.trim();

    if (!fullName || !username || !department) {
      alert("Please fill all required fields.");
      return;
    }

    const userProfile = {
  fullName,
  username,
  department,
  bio,
  interests: selectedInterests,
  profilePic: profileImageBase64,  // <-- Add this line
};


    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    navigate("/profilepage");
  };

  return (
    <div className="create-profile-page">
      <div className="container">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="logo">
            <img src={logo} alt="Quorum_Logo" />
          </div>
          <h2>Connect with Your University Community</h2>
          <p>Quorum helps you network with students, join groups, and stay updated with campus events.</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="progress-bar">
            <div className="progress" style={{ width: "0%" }}></div>
          </div>

          <h1>Complete Your Profile</h1>

          {/* PROFILE PICTURE */}
          {/* PROFILE PICTURE */}
<div className="profile-picture">
  <div
    className="profile-img"
    onClick={() => document.getElementById("profile-pic-input").click()}
  >
    <img
      id="profile-preview-img"
      alt="Profile Preview"
      style={{
        display: "none",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
    <div className="camera-icon">📷</div>
  </div>

  {/* Upload text beside the picture */}
  <div
    className="upload-photo-text"
    style={{ marginLeft: "15px", cursor: "pointer", color: "#df5e3dff" }}
    onClick={() => document.getElementById("profile-pic-input").click()}
  >
    <strong>Upload Photo</strong>
  </div>
</div>

          <input type="file" id="profile-pic-input" accept="image/*" style={{ display: "none" }} />

          <form id="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name *</label>
              <input type="text" id="fullname" placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input type="text" id="username" placeholder="your_username" required />
              <div className="checkbox-container">
                <input type="checkbox" id="username-check" />
                <label htmlFor="username-check">I understand that my username cannot be changed later</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select id="department" required>
                <option value="">Select your department</option>
                <option value="cs">Computer Science</option>
                <option value="eng">Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" placeholder="Tell us about yourself..." maxLength="500"></textarea>
              <div className="char-count">0/500</div>
            </div>

            {/* INTERESTS */}
            <div className="interests-section">
              <div className="interests-title">Interests (Select up to 10)</div>
              <p className="input-hint">Choose a few interests to connect with like-minded students</p>

              <div className="popular-interests">
                {["Sports", "Music", "Photography", "Gaming", "Reading", "Travel", "Art", "Technology"].map(
                  (item) => (
                    <div key={item}>
                      <input
                        type="checkbox"
                        id={`interest-${item.toLowerCase()}`}
                        className="interest-checkbox"
                        value={item}
                        onChange={handleInterestChange}
                      />
                      <label htmlFor={`interest-${item.toLowerCase()}`} className="interest-label">
                        {item}
                      </label>
                    </div>
                  )
                )}
              </div>

              <div className="selected-count">{selectedInterests.length}/10 interests selected</div>
            </div>

            <div className="button-container">
              <button type="submit" className="btn">Complete Profile</button>
              <button type="button" className="skip-btn" onClick={() => navigate("/ProfilePage")}>
                Skip for now
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
