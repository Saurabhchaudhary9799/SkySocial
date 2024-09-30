

import { Button } from "@/components/ui/button"

import './App.css'
import { Route, Routes } from "react-router-dom"
import Register from "./page/Register"

import Layout from "./components/Layout"
import Home from "./page/Home"
import Profile from "./page/Profile"
import AnotherProfile from "./components/AnotherProfile"
import Chatpage from "./page/Chatpage"


function App() {
  
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          {/* Nested Routes */}
          <Route index element={<Home />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path=":userId" element={<AnotherProfile />} />
          <Route path="chats" element={<Chatpage/>}/>
        </Route>
        <Route path="/register" element={<Register />} />
      </Routes>
  )
}

export default App
