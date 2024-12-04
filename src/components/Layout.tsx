import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
// import { PostProvider } from "@/context/PostContext";
import {  useUser } from "@/context/userContext";
import { socket } from "@/Config/socketConfig";

const Layout = () => {
  const { user } = useUser();
  const userId = user?.userid;
  useEffect(() => {
    socket.emit("user-joined", userId);
  }, [userId]);

  return (
    <>
      <div>
        <Header />

        {/* The Outlet renders the matched child route */}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
