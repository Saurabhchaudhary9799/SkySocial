import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useUser } from "@/context/userContext";
const ProfileBox = () => {
    const { user } = useUser();
    const userId = user?.userid;
    return (_jsxs("div", { className: "max-w-sm mx-auto bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { className: "w-full h-24 object-cover", src: user?.cover_image, alt: "cover" }), _jsx("img", { className: "absolute left-4 bottom-[-32px] w-16 h-16 rounded-full border-4 border-white object-cover", src: user?.profile_image, alt: "profile" })] }), _jsxs("div", { className: "text-center p-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: user?.name }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["@", user?.username] }), _jsx("p", { className: "text-sm mt-2", children: user?.bio })] }), _jsxs("div", { className: "flex justify-around border-t border-gray-700 py-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-lg font-bold", children: user?.followings.length }), _jsx("p", { className: "text-gray-400 text-sm", children: "Following" })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-lg font-bold", children: user?.followers.length }), _jsx("p", { className: "text-gray-400 text-sm", children: "Followers" })] })] }), _jsx("div", { className: "text-center pb-4", children: _jsx(Link, { to: `/profile/${userId}`, className: "text-blue-500 hover:underline", children: "My Profile" }) })] }));
};
export default ProfileBox;
