import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateProfile from "./pages/CreateProfile";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Hackathons from "./pages/Hackathons";
import CreateHackathon from "./pages/CreateHackathon";
import HackathonDetails from "./pages/HackathonDetails";
import Chat from "./pages/chat";    // correct



//  lowercase imports for poll & chatscroll
import Poll from "./pages/poll";
import ChatScroll from "./pages/chatscroll";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />

        {/* Create Profile Page */}
        <Route path="/CreateProfile" element={<CreateProfile />} />

        {/* Profile Page */}
        <Route path="/ProfilePage" element={<ProfilePage />} />

        {/* Post Page */}
        <Route path="/PostPage" element={<PostPage />} />

        {/* Events Pages */}
        <Route path="/Events" element={<Events />} />
        <Route path="/CreateEvent" element={<CreateEvent />} />

        {/* Hackathon Pages */}
        <Route path="/Hackathons" element={<Hackathons />} />
        <Route path="/CreateHackathon" element={<CreateHackathon />} />
        <Route path="/HackathonDetails" element={<HackathonDetails />} />

        {/* Polls Page */}
       
        <Route path="/poll" element={<Poll />} />

        {/*  Chat Page */}
        <Route path="/chatscroll" element={<ChatScroll />} />
           <Route path="/chat" element={<Chat />} />

      </Routes>
    </Router>
  );
}

export default App;
