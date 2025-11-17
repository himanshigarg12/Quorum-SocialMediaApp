import { useEffect, useState } from "react";
import "./PostPage.css";
import logo from "../assets/Quorum_logo.png";
import { useNavigate } from "react-router-dom";

function PostPage() {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({
    fullName: "New User",
    username: "@new_user",
    avatarUrl: "https://i.pravatar.cc/40?img=20",
  });

  const [posts, setPosts] = useState(() => {
    return JSON.parse(localStorage.getItem("userPosts")) || [];
  });

  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ Load profile info from localStorage
  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
      if (storedProfile) {
        setUserProfile({
          fullName: storedProfile.fullName || "New User",
          username: storedProfile.username
            ? `@${storedProfile.username}`
            : "@new_user",
          avatarUrl:
  storedProfile.profilePic || "https://i.pravatar.cc/40?img=20",


        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  }, []);

  // ✅ Google Translate API
  async function translateText(text, targetLanguage = "hi") {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
        text
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data) && data[0] && data[0][0]) {
        return data[0].map((segment) => segment[0]).join("");
      }
      return text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
  };

  // ✅ Handle image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Create post
  const handleCreatePost = () => {
    if (newPostText.trim() === "" && !selectedImage) {
      alert("Please enter text or upload an image before posting.");
      return;
    }

   const newPost = {
  text: newPostText.trim(),
  image: selectedImage,
  likes: 0,
  timestamp: new Date().toISOString(),   // ⏱ real time
  avatar: userProfile.avatarUrl,
  fullName: userProfile.fullName,
  username: userProfile.username,
};



    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);

    setNewPostText("");
    setSelectedImage(null);
  };

  // ✅ Delete post
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const updated = posts.filter((_, i) => i !== index);
      savePosts(updated);
    }
  };

  // ✅ Like toggle
  const handleLike = (index) => {
    const updatedPosts = [...posts];
    updatedPosts[index].likes =
      updatedPosts[index].likes > 0 ? 0 : 1;
    savePosts(updatedPosts);
  };

  // ✅ Translate toggle
  const handleTranslate = async (index) => {
    const updatedPosts = [...posts];
    const post = updatedPosts[index];
    if (post.translatedText) {
      delete post.translatedText;
    } else {
      post.translatedText = await translateText(post.text, "hi");
    }
    savePosts(updatedPosts);
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="Quorum Logo" className="logo" />
          <h1>Quorum</h1>
        </div>

        <div className="nav-menu">
          <div className="nav-menu">
          <a href="/PostPage"><span className="nav-icon icon-feed"></span> Feed</a>
          <a href="/ProfilePage"><span className="nav-icon icon-profile"></span> Profile</a>
          <a href="/chatscroll"><span className="nav-icon icon-chat"></span> Chat</a>
          <a href="/Events" className="active"><span className="nav-icon icon-events"></span> Events</a>
          <a href="/poll"><span className="nav-icon icon-polls"></span> Polls</a>
          <a href="/Hackathons"><span className="nav-icon icon-hackathon"></span> Hackathon</a>
     
</div>

        </div>

        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-box"
            placeholder="Search Quorum..."
          />
        </div>
      </nav>

      {/* ✅ Main Layout */}
      <div className="container">
        {/* === LEFT COLUMN === */}
        <div>
          <div className="create-post">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What's happening on campus?"
            ></textarea>

            {/* Image preview */}
            {selectedImage && (
              <div className="preview-container" style={{ position: "relative" }}>
                <img
                  src={selectedImage}
                  alt="preview"
                  className="preview-img"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
                <button
                  className="remove-img-btn"
                  onClick={() => setSelectedImage(null)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "var(--dark-red)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                    width: "25px",
                    height: "25px",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <div className="post-options">
              <div className="icons">
                <label>
                  📷 Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>
              <button onClick={handleCreatePost}>Post</button>
            </div>
          </div>

          {/* === Render Posts === */}
          {posts.map((post, index) => (
            <div key={index} className="post">
              <div className="post-header">
                <div className="user">
                  <img src={post.avatar || userProfile.avatarUrl} alt={post.fullName || userProfile.fullName} />

                  <div>
                    <h3>{userProfile.fullName}</h3>
                    <p>
                      {userProfile.username} · {post.timeAgo}
                    </p>
                  </div>
                </div>
                <span
                  className="delete-post"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(index)}
                >
                  ❌
                </span>
              </div>

              <div className="post-content">
                <p>{post.text}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="post-image"
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  />
                )}

                {post.translatedText && (
                  <div className="translation-box">
                    <div
                      className="translation-label"
                      style={{
                        fontSize: "13px",
                        color: "gray",
                        marginTop: "10px",
                      }}
                    >
                      🌐 Translated to Hindi:
                    </div>
                    <div>{post.translatedText}</div>
                  </div>
                )}
              </div>

              <div className="post-actions">
                <span
                  onClick={() => handleLike(index)}
                  className="post-action"
                >
                  👍 {post.likes}
                </span>
                <span
                  onClick={() => handleTranslate(index)}
                  className="translate-action post-action"
                >
                  🌐 Translate
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* === RIGHT SIDEBAR === */}
        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Trending at Quorum</h3>
            <ul className="trending">
              <li>#QuorumTech – 1248 posts</li>
              <li>#CampusLife – 892 posts</li>
              <li>#StudyGroup – 567 posts</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Who to follow</h3>
            <div className="follow-suggest">
              <div>
                <img src="https://i.pravatar.cc/40?img=4" alt="Ananya" />
                <div className="user-info">
                  <span>Ananya Patel</span>
                  <span>@ananya_pat</span>
                </div>
              </div>
              <button>Follow</button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Footer */}
      <div className="footer">
        <p>Quorum - Campus Social Network © 2025 | Terms | Privacy | About</p>
      </div>
    </>
  );
}

export default PostPage;
