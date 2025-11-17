import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/Quorum_logo.png";
import backgroundImage from "../assets/loginbackground.jpg";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [emailClass, setEmailClass] = useState("");
  const [passwordClass, setPasswordClass] = useState("");

  const universityEmailPattern = /^[a-zA-Z0-9._%+-]+@chitkara\.edu\.in$/i;
  const minPasswordLength = 6;

  const displayError = (message) => setErrorText(`⚠ ${message}`);
  const clearError = () => setErrorText("");
  const setInputStatus = (setter, valid) =>
    setter(valid ? "valid-field" : "invalid-field");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    let valid = true;
    const trimmedEmail = email.trim();

    // Validate Email
    if (trimmedEmail === "") {
      displayError("Email field cannot be empty.");
      setInputStatus(setEmailClass, false);
      valid = false;
    } else if (!universityEmailPattern.test(trimmedEmail)) {
      displayError("Only email addresses ending in @chitkara.edu.in are allowed.");
      setInputStatus(setEmailClass, false);
      valid = false;
    } else setInputStatus(setEmailClass, true);

    // Validate Password
    if (password === "") {
      if (valid) displayError("Password field cannot be empty.");
      setInputStatus(setPasswordClass, false);
      valid = false;
    } else if (password.length < minPasswordLength) {
      if (valid)
        displayError(`Password must be at least ${minPasswordLength} characters long.`);
      setInputStatus(setPasswordClass, false);
      valid = false;
    } else setInputStatus(setPasswordClass, true);

    if (!valid) return;

    try {
      const response = await fetch(
        `http://localhost:5000/users?email=${encodeURIComponent(trimmedEmail)}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const users = await response.json();

      if (users.length === 0) {
        displayError("No user found with this email.");
        setInputStatus(setEmailClass, false);
        return;
      }

      const user = users[0];

      if (user.password === password) {
        alert(`Welcome, ${user.fullname}!`);
        localStorage.setItem("currentUser", JSON.stringify(user));

        if (!user.hasProfile) navigate("/CreateProfile");
        else navigate("/ProfilePage");

      } else {
        displayError("Incorrect password. Please try again.");
        setInputStatus(setPasswordClass, false);
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      displayError("Unable to connect to the server. Please try again.");
    }
  };

  const handleEmailBlur = () => {
    const trimmedEmail = email.trim();
    if (trimmedEmail !== "") {
      const isValid = universityEmailPattern.test(trimmedEmail);
      setInputStatus(setEmailClass, isValid);
      if (isValid) clearError();
    } else setEmailClass("");
  };

  const handlePasswordBlur = () => {
    if (password !== "") {
      const isValid = password.length >= minPasswordLength;
      setInputStatus(setPasswordClass, isValid);
    } else setPasswordClass("");
  };

  return (
    <div className="login-page">
      <div
        className="left-side"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className="right-side">
        <div className="login-card">
          <div className="logo">
            <img src={logo} alt="Quorum Logo" />
            <h1>Quorum</h1>
          </div>

          <p className="subtitle">Connect with your university community</p>

          <div className={`error${errorText ? " show" : ""}`}>
            {errorText ||
              "⚠ Only university email addresses (name@chitkara.edu.in) are allowed to access this platform."}
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">University Email</label>
            <input
              type="email"
              id="email"
              placeholder="your.name@chitkara.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              className={emailClass}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              className={passwordClass}
            />

            <div className="forgot">
              <a href="#">Forgot your password?</a>
            </div>

            <button type="submit" className="sign-in-btn">
              Sign In to Quorum
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
