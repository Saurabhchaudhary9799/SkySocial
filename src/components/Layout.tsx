import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import { PostProvider } from "@/context/PostContext";
import { UserProvider } from "@/context/userContext";


const Layout = () => {
  return (
    <>

      <UserProvider>
        <PostProvider>
          <div>
            <Header />

            {/* The Outlet renders the matched child route */}
            <Outlet />
          </div>
        </PostProvider>
      </UserProvider>
     
    </>
  );
};

export default Layout;
