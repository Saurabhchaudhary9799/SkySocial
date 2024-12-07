import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(UserProvider, { children: _jsx(PostProvider, { children: _jsxs(Routes, { children: [_jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "profile/:userId", element: _jsx(Profile, {}) }), _jsx(Route, { path: ":userId", element: _jsx(AnotherProfile, {}) }), _jsx(Route, { path: "chats", element: _jsx(Chatpage, {}) }), _jsx(Route, { path: "custom-challenges/tic-tac-toe", element: _jsx(ChallengePage, {}) }), _jsx(Route, { path: "custom-challenges/tic-tac-toe/:userId", element: _jsx(GamePage, {}) })] }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) })] }) }) }));
}
export default App;
