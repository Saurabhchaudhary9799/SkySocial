import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
// import { PostProvider } from "@/context/PostContext";
import { useUser } from "@/context/userContext";
import { socket } from "@/Config/socketConfig";
const Layout = () => {
    const { user } = useUser();
    const userId = user?.userid;
    useEffect(() => {
        socket.emit("user-joined", userId);
    }, [userId]);
    return (_jsx(_Fragment, { children: _jsxs("div", { children: [_jsx(Header, {}), _jsx(Outlet, {})] }) }));
};
export default Layout;
