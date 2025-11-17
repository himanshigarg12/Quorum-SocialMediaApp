import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // navigation hook
import "./ProfilePage.css";
import logo from "../assets/Quorum_logo.png";

function ProfilePage() {
  const navigate = useNavigate(); // initialize navigation

  useEffect(() => {
    // === DOM Mapping ===
    const profilePicElement = document.querySelector(".profile-pic");
    const fullNameElement = document.querySelector(".profile-info h2");
    const usernameElement = document.querySelector(".username");
    const locationElement = document.querySelector(".location-join span:first-child");
    const joinDateElement = document.querySelector(".location-join span:last-child");
    const bioElement = document.querySelector(".bio");
    const departmentLink = document.querySelector(".department");
    const followersNumber = document.querySelector(".stat:nth-child(1) .stat-number");
    const followingNumber = document.querySelector(".stat:nth-child(2) .stat-number");
    const postsNumber = document.querySelector(".stat:nth-child(3) .stat-number");
    const interestTagsContainer = document.querySelector(".interest-tags");
    const postsContainer = document.querySelector(".posts-section");

    // === Data Retrieval ===
    const storedData = localStorage.getItem("userProfile");
    if (!storedData) {
      alert("No profile data found. Please complete your profile first.");
      return;
    }

    const profile = JSON.parse(storedData);

    // === Utility ===
    const getInitials = (fullName) => {
      if (!fullName) return "?";
      const parts = fullName.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // === Profile Picture ===
    const postAvatars = document.querySelectorAll(".post-avatar");

    // ✅ FIXED: use profile.profilePic instead of profile.profileImageBase64
    if (profile.profilePic) {
      profilePicElement.style.backgroundImage = `url(${profile.profilePic})`;
      profilePicElement.style.backgroundSize = "cover";
      profilePicElement.style.backgroundPosition = "center";
      profilePicElement.style.fontSize = "0";
      profilePicElement.textContent = "";

      postAvatars.forEach((avatar) => {
        avatar.style.backgroundImage = `url(${profile.profilePic})`;
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
        avatar.style.fontSize = "0";
        avatar.textContent = "";
      });
    } else {
      const initials = getInitials(profile.fullName);
      profilePicElement.textContent = initials;
      postAvatars.forEach((avatar) => (avatar.textContent = initials));
    }

    // === Profile Info ===
    fullNameElement.textContent = profile.fullName || "User Name";
    usernameElement.textContent = `@${profile.username}` || "@user";
    const displayDepartment = profile.department
      ? profile.department
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Department";
    departmentLink.textContent = displayDepartment;
    departmentLink.href = `#${profile.department}`;
    bioElement.textContent = profile.bio || "This user has not written a bio yet.";
    locationElement.innerHTML = `📍 University Campus`;
    joinDateElement.innerHTML = `📅 Joined 2025`;

    // === Stats ===
    followersNumber.textContent = profile.followers || "0";
    followingNumber.textContent = profile.following || "0";
    postsNumber.textContent = profile.posts || "0";

    // === Interests ===
    interestTagsContainer.innerHTML = "";
    if (profile.interests && profile.interests.length > 0) {
      profile.interests.forEach((interest) => {
        const displayText = interest
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const tag = document.createElement("span");
        tag.className = "interest-tag";
        tag.textContent = displayText;
        interestTagsContainer.appendChild(tag);
      });
    } else {
      interestTagsContainer.innerHTML =
        '<span class="comments-disabled">No interests selected.</span>';
    }

    // === Load User Posts ===
    const storedPosts = localStorage.getItem("userPosts");
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      const dummyPosts = postsContainer.querySelectorAll(".post");
      dummyPosts.forEach((post) => post.remove());

      posts.forEach((post, index) => {
        const postDiv = document.createElement("div");
        postDiv.className = "post";

        const avatarHTML = profile.profilePic ? "" : getInitials(profile.fullName);
        let postImageHTML = "";
        if (post.image) {
          postImageHTML = `<img src="${post.image}" style="width:100%; max-height:400px; object-fit:cover; border-radius:6px; margin:10px 0;">`;
        }

        postDiv.innerHTML = `
          <div class="post-header" style="display:flex; align-items:center;">
            <div class="post-avatar" ${
              profile.profilePic
                ? `style="background-image:url(${profile.profilePic}); background-size:cover; background-position:center; font-size:0"`
                : ""
            }>${avatarHTML}</div>
            <div class="post-user" style="margin-left:10px;">
              <h3>${profile.fullName}</h3>
              <p>@${profile.username} • ${post.timeAgo || "Just now"}</p>
            </div>
            <div class="post-delete" style="cursor:pointer; color:var(--primary-red); margin-left:auto;">❌</div>
          </div>
          <div class="post-content">${post.text.replace(/\n/g, "<br>")}</div>
          ${postImageHTML}
          <div class="post-hashtags">${post.hashtags || ""}</div>
          <div class="post-actions">
            <div class="post-action">👍 ${post.likes || 0}</div>
          </div>
        `;

        // Delete Function
        const deleteBtn = postDiv.querySelector(".post-delete");
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this post?")) {
            postsContainer.removeChild(postDiv);
            posts.splice(index, 1);
            localStorage.setItem("userPosts", JSON.stringify(posts));
          }
        });

        postsContainer.appendChild(postDiv);
      });
    }
  }, []);

  return (
    <div className="profile-page-container">
      <div className="container">
        <div className="profile-card">
          <div className="cover-photo"></div>
          <div className="profile-info">
            <div className="profile-pic">JD</div>
            <h2>John Doe</h2>
            <span className="username">@johndoe_cs</span>
            <div className="location-join">
              <span>📍 University Campus</span>
              <span>📅 Joined September 2023</span>
            </div>
            <p className="bio">Passionate computer science student interested in web development.</p>
            <a href="#" className="department">Computer Science</a>
            <div className="stats">
              <div className="stat">
                <div className="stat-number">245</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat">
                <div className="stat-number">180</div>
                <div className="stat-label">Following</div>
              </div>
              <div className="stat">
                <div className="stat-number">3</div>
                <div className="stat-label">Posts</div>
              </div>
            </div>
          </div>

          <div className="interests">
            <h3>Interests</h3>
            <div className="interest-tags"></div>
          </div>
        </div>

        <div className="posts-section">
          <div className="top-actions">
            <button
              className="action-button"
              title="Create a new post"
              onClick={() => navigate("/PostPage")}
            >
              ✍️
            </button>
          </div>
          <h2>My Posts</h2>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
