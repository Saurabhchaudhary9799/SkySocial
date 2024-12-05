import { Button } from "@/components/ui/button";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./page/Register";

import Layout from "./components/Layout";
import Home from "./page/Home";
import Profile from "./page/Profile";
import AnotherProfile from "./components/AnotherProfile";
import Chatpage from "./page/Chatpage";
import ChallengePage from "./components/ChallengePage";
import { UserProvider } from "./context/userContext";
import { PostProvider } from "./context/PostContext";
import GamePage from "./components/GamePage";

function App() {
  return (
    <UserProvider>
      <PostProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Nested Routes */}
            <Route index element={<Home />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path=":userId" element={<AnotherProfile />} />
            <Route path="chats" element={<Chatpage />} />
            <Route
              path="custom-challenges/tic-tac-toe"
              element={<ChallengePage />}
            />
              <Route path="custom-challenges/tic-tac-toe/:userId" element={<GamePage />} />
            
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
      </PostProvider>
    </UserProvider>
  );
}

export default App;
