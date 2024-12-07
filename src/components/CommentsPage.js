import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import axios from "axios";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeElapsed } from "@/utils/timeUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { useUser } from "@/context/userContext";
import { usePostContext } from "@/context/PostContext";
const CommentsPage = ({ postId, comments }) => {
    const { user } = useUser();
    const { deleteComment } = usePostContext();
    const [allComments, setAllComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State for dialog open/close
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    // Fetch comments when dialog opens
    useEffect(() => {
        if (isOpen) {
            handleShowComments();
        }
    }, [isOpen]);
    const handleShowComments = async () => {
        try {
            setLoading(true);
            const userData = localStorage.getItem("userData");
            const authToken = userData ? JSON.parse(userData).authToken : null;
            // console.log('authToken',authToken);
            const response = await axios.get(`${BASE_URL}/api/v1/posts/${postId}/comments`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setAllComments(response?.data.data);
            console.log(allComments);
        }
        catch (error) {
            console.error("Error fetching comments:", error);
            setError("Failed to load comments.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(postId, commentId);
            setAllComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        }
        catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    return (_jsx(_Fragment, { children: _jsxs(Dialog, { open: isOpen, onOpenChange: (open) => setIsOpen(open), children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs("span", { className: "cursor-pointer", children: ["View all ", comments.length, " comments"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[425px] bg-gray-800", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "See all comments" }) }), loading ? (_jsx("p", { children: "Loading comments..." })) : error ? (_jsx("p", { className: "text-red-500", children: error })) : allComments.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No comments" })) : (_jsx("div", { className: "space-y-3 h-[300px] overflow-y-auto p-2", children: allComments.map((comment) => (_jsxs("div", { className: "flex justify-between bg-gray-900 rounded-lg p-2", children: [_jsxs("div", { className: "flex space-x-3", children: [_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: comment.user.profile_image, alt: "profile_image" }), _jsx(AvatarFallback, { children: comment.user.username.charAt(0).toUpperCase() })] }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-semibold text-white", children: comment.user.username }), _jsx("div", { className: "text-sm text-gray-400", children: comment.message }), _jsx("div", { className: "text-xs text-gray-500", children: formatTimeElapsed(comment.createdAt) })] })] }), _jsx("div", { className: `${comment.user.id !== user?.userid && "hidden"}`, children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: _jsx(BsThreeDots, {}) }), _jsx(DropdownMenuContent, { children: _jsx(DropdownMenuItem, { onClick: () => handleDeleteComment(comment._id), children: "Delete Comment" }) })] }) })] }, comment._id))) }))] })] }) }));
};
export default CommentsPage;
