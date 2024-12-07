import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaFacebookMessenger } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaTwitter } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { FaCaretDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { socket } from "@/Config/socketConfig";
const Header = () => {
    const [notifications, setNotifications] = useState([]);
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
            socket.on("receiveNotification", (notification) => {
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
    return (_jsx("div", { className: "header py-2 md:px-8 ", children: _jsxs("div", { className: "container flex justify-between  mx-auto px-4 ", children: [_jsx("div", { className: "logo flex justify-center items-center ", children: _jsx(Link, { to: "/", children: _jsxs("div", { className: "logo-brand flex justify-center items-center gap-x-5", children: [_jsx("span", { children: _jsx(FaTwitter, {}) }), _jsx("h1", { children: "SkySocial" })] }) }) }), _jsxs("div", { className: "flex  justify-center items-center gap-x-2 sm:gap-x-5", children: [_jsx(Link, { className: "hidden sm:block", to: "/", children: _jsxs(Button, { className: "home bg-white hover:bg-white rounded-2xl text-black", children: [_jsx(GoHomeFill, { className: "mr-2 h-4 w-4 fill-blue-500 text-white text-2xl" }), " ", "Home"] }) }), _jsx(Link, { to: "/chats", children: _jsx("span", { className: "message text-xl", children: _jsx(FaFacebookMessenger, {}) }) }), _jsxs(Dialog, { children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("div", { className: "notification text-xl relative cursor-pointer", children: [_jsx("span", { onClick: () => setIsOpen(!isOpen), children: _jsx(IoMdNotifications, {}) }), notifications.length > 0 && (_jsx("span", { className: "absolute -top-2 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-sm", children: notifications.length }))] }) }), _jsxs(DialogContent, { className: "bg-gray-800 ", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "See All Notifications" }), _jsx(DialogDescription, { children: notifications.length > 0 ? _jsx("div", { className: "flex flex-col gap-y-2 justify-center items-start text-white", children: notifications.map((n, i) => (_jsx("span", { children: n.message }, i))) }) : "no notifications yet" })] }), notifications.length > 0 && (_jsx("div", { className: "flex justify-end mt-4", children: _jsx(Button, { onClick: clearNotifications, className: "clear-notifications bg-red-600 hover:bg-red-700 text-white", children: "Clear All" }) }))] })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { className: "profile flex justify-center items-center gap-x-2 py-5 px-3 rounded-2xl bg-gray-800 hover:bg-gray-800", children: [_jsxs(Avatar, { className: "w-8 h-8", children: [_jsx(AvatarImage, { src: user?.profile_image }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("span", { className: "hidden sm:block", children: user?.username }), _jsx("span", { children: _jsx(FaCaretDown, {}) })] }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuLabel, { children: "My Account" }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuItem, { children: _jsx(Link, { to: `/profile/${userId}`, children: "My Profile" }) }), _jsx(DropdownMenuItem, { onClick: handleLogout, children: "Log out" })] })] })] })] }) }));
};
export default Header;
