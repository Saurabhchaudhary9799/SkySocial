import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaTwitter } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { TbMessageCircleFilled } from "react-icons/tb";
import { FaCaretDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socket } from "@/Config/socketConfig";

interface Notification {
  message: string;
}

const Header = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();

  const userId = user?.userid;
  // console.log('header',userId)
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("userData");

    // Update the user context
    setUser(null);

    // Redirect to login page or home page
    navigate("/register"); // Adjust this route as needed
  };

  useEffect(() => {
    if (user) {
      socket.emit("user-joined", userId);

      socket.on("receiveNotification", (notification: Notification) => {
        setNotifications((prev) => [...prev, notification]);
      });
    }

    return () => {
      socket.off("receiveNotification");
    };
  }, [user, userId]);

  

  const clearNotifications = () => {
    setNotifications([]); // Clear notifications
  };
  return (
    <div className="header py-2 md:px-8 ">
      <div className="container flex justify-between  mx-auto px-4 ">
        <div className="logo flex justify-center items-center ">
          <Link to="/">
          <div className="logo-brand flex justify-center items-center gap-x-5">
            <span>
              <FaTwitter />
            </span>
            <h1>SkySocial</h1>
          </div>
          </Link>
          {/* <div className="search hidden sm:block">
            <input
              className="bg-gray-800 px-2 py-1 rounded-xl"
              type="search"
              placeholder="# explore"
            />
          </div> */}
        </div>
        <div className="flex  justify-center items-center gap-x-2 sm:gap-x-5">
          <Link className="hidden sm:block" to="/">
            <Button className="home bg-white hover:bg-white rounded-2xl text-black">
              <GoHomeFill className="mr-2 h-4 w-4 fill-blue-500 text-white text-2xl" />{" "}
              Home
            </Button>
          </Link>
          <Link to="/chats">
            <span className="message text-xl">
              <FaFacebookMessenger />
            </span>
          </Link>

          <Dialog >
            <DialogTrigger asChild>
              <div className="notification text-xl relative cursor-pointer">
                <span onClick={() => setIsOpen(!isOpen)}>
                  <IoMdNotifications />
                </span>
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-sm">
                    {notifications.length}
                  </span>
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 ">
              <DialogHeader>
                <DialogTitle>See All Notifications</DialogTitle>
                <DialogDescription>
                  {
                    notifications.length > 0 ? <div className="flex flex-col gap-y-2 justify-center items-start text-white">{notifications.map((n, i) => (
                      <span key={i}>{n.message}</span>
                    ))}</div> :"no notifications yet"
                  }
                  
                </DialogDescription>
              </DialogHeader>
              {notifications.length > 0 && (
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={clearNotifications}
                    className="clear-notifications bg-red-600 hover:bg-red-700 text-white"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="profile flex justify-center items-center gap-x-2 py-5 px-3 rounded-2xl bg-gray-800 hover:bg-gray-800">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profile_image} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">{user?.username}</span>
                <span>
                  <FaCaretDown />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/profile/${userId}`}>My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
