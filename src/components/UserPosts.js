import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import CircleLoader from "./CircleLoader";
const UserPosts = ({ posts, updateUserProfile }) => {
    const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    const handleDelete = async (postId) => {
        try {
            setLoading(true);
            const userData = localStorage.getItem("userData");
            const authToken = userData ? JSON.parse(userData).authToken : null;
            const response = await axios.delete(`${BASE_URL}/api/v1/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.data.status === "success") {
                toast.success("post deleted successfully");
            }
            updateUserProfile("deletePost", postId);
            setLoading(false);
        }
        catch (error) {
            toast.error(`Error ${error.message}`);
        }
    };
    return (_jsx("section", { className: "post-section py-5", children: posts.length > 0 ? (_jsx("div", { className: "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ", children: posts.map((post) => (_jsxs("div", { className: "saved-post-card ", children: [_jsx("img", { src: post.image, alt: "Saved Post", className: "w-full h-auto object-cover mb-2" }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { className: "flex gap-x-5", children: [_jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaRegComment, {}) }), " ", post.comments.length] }), _jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaHeart, {}) }), " ", post.likes.length, " "] })] }), _jsxs("div", { className: "cursor-pointer", onClick: () => handleDelete(post.id), children: [" ", loading ? _jsx(CircleLoader, {}) : _jsx("span", { children: _jsx(MdDelete, {}) })] })] })] }, post.id))) })) : (_jsx("span", { children: "No posts yet" })) }));
};
export default UserPosts;
