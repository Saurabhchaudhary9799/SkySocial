import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark, FaRegSmile } from "react-icons/fa";
import { formatTimeElapsed } from "@/utils/timeUtils";
import axios from "axios";
import { toast } from "sonner";
import CommentsPage from "./CommentsPage";
import { usePostContext } from "@/context/PostContext";
import { useUser } from "@/context/userContext";
import { FaHeart } from "react-icons/fa";
import { socket } from "@/Config/socketConfig";
import EmojiPicker from "emoji-picker-react";
import { FaBookmark } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
const Post = ({ post }) => {
    const { createComment, handleLikes, deletePost } = usePostContext();
    const { user, updateUser } = useUser(); // Get the current logged-in user
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // Track follow/unfollow status
    const [showPicker, setShowPicker] = useState(false);
    const postId = post._id;
    const userId = user?.userid; // console.log(post)
    const [userSavedPost, setUserSavedPost] = useState(false);
    const addEmoji = (emojiObject) => {
        // console.log(emojiObject.emoji);
        setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append the selected emoji to the message
    };
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    useEffect(() => {
        // Check if the post's user is already in the current user's followings array
        if (user?.followings.some((following) => following.following === post.user?._id)) {
            setIsFollowing(true);
        }
        else {
            setIsFollowing(false);
        }
        if (user?.savedPosts.some((savedPost) => savedPost.post === post._id)) {
            setUserSavedPost(true);
        }
        else {
            setUserSavedPost(false);
        }
    }, [user, post.user?._id]);
    const handleCreateComment = async () => {
        try {
            setLoading(true);
            await createComment(message, postId);
            if (post.user?._id !== user?.userid) {
                socket.emit("commentOnPost", {
                    userId: post.user?._id,
                    username: user?.username,
                    postId: post._id,
                });
            }
            setMessage("");
            toast.success("commented successfully!");
        }
        catch (error) {
            toast.error(`error ${error.message}`);
        }
        finally {
            setLoading(false);
        }
    };
    const comments = post.comments ?? [];
    const likes = post.likes ?? [];
    const userHasLiked = likes.some((like) => like.user === user?.userid);
    //  console.log(userHasLiked)
    const onLikeClick = async () => {
        try {
            await handleLikes(post._id);
            if (post.user?._id !== user?.userid) {
                socket.emit("likePost", {
                    userId: post.user?._id,
                    username: user?.username,
                    postId: post._id,
                    action: !userHasLiked ? "liked" : "unliked",
                });
            }
        }
        catch (error) {
            console.error("Error liking/unliking post:", error);
        }
    };
    const handleDeletePost = async () => {
        try {
            await deletePost(post._id);
            toast.success("post deleted successfully!");
        }
        catch (error) {
            console.error("Error deleting post:", error);
        }
    };
    const handleFollowUnfollow = async (id) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/users/${id}/follower`, {}, {
                headers: {
                    Authorization: `Bearer ${user?.authToken}`,
                },
            });
            if (response?.data.message === "Followed successfully") {
                setIsFollowing(true); // Update the follow status
                updateUser({
                    ...user,
                    followings: [
                        ...user.followings,
                        { following: id }, // Add the new following ID
                    ],
                });
            }
            else {
                setIsFollowing(false); // Update the follow status
                // Handle unfollow by removing the ID from the followings array
                updateUser({
                    ...user,
                    followings: user.followings.filter((f) => f.following !== id),
                });
            }
            if (post.user?._id !== user?.userid) {
                socket.emit("followAndUnfollowUser", {
                    userId: post.user?._id,
                    username: user?.username,
                    postId: post._id,
                    action: response?.data.message === "Followed successfully"
                        ? "followed"
                        : "unfollowed",
                });
            }
        }
        catch (error) {
            toast.error("Error is", error.message);
        }
    };
    const handleSaveUnsavePost = async () => {
        try {
            const authToken = user?.authToken;
            const response = await axios.post(`${BASE_URL}/api/v1/posts/${post._id}/save`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            console.log(response.data);
            if (response.data.message === "Post saved") {
                updateUser({
                    ...user,
                    savedPosts: [
                        ...(user?.savedPosts || []),
                        {
                            _id: response.data.save._id, // Assuming the response contains the new saved post's ID
                            post: response.data.save.post, // The postId you are saving
                            user: response.data.save.user, // Current user's ID
                        },
                    ],
                });
                setUserSavedPost(true);
            }
            else if (response.data.message === "Post unsaved") {
                updateUser({
                    ...user,
                    savedPosts: user?.savedPosts.filter(savedPost => savedPost.post !== postId) || []
                });
                setUserSavedPost(false);
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center ", children: [_jsx(Link, { to: `${post.user?._id !== user?.userid
                            ? `/${post.user?._id}`
                            : `/profile/${post.user?._id}`}`, children: _jsxs("div", { className: "flex items-center gap-x-2", children: [_jsxs(Avatar, { className: "w-8 h-8", children: [_jsx(AvatarImage, { src: post.user?.profile_image }), _jsx(AvatarFallback, { children: "CN" })] }), _jsxs("div", { className: "flex flex-col text-sm text-gray-300", children: [_jsx("span", { children: post.user?.username }), _jsx("span", { children: formatTimeElapsed(post.createdAt) })] })] }) }), _jsx("div", { children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { children: _jsx(BsThreeDots, {}) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { className: `${post.user?._id === user?.userid && "hidden"}`, onClick: () => handleFollowUnfollow(post.user?._id), children: isFollowing ? "Unfollow" : "Follow" }), _jsx(DropdownMenuItem, { className: `${post.user?._id !== user?.userid && "hidden"}`, onClick: handleDeletePost, children: "Delete Post" }), _jsx(DropdownMenuItem, { className: `${post.user?._id !== user?.userid && "hidden"}`, onClick: handleDeletePost, children: "Edit Post" })] })] }) })] }), _jsx("div", { className: "relative w-full pb-[100%] bg-gray-200 overflow-hidden rounded-lg", children: _jsx("img", { src: post.image, alt: "post", className: "absolute inset-0 w-full h-full object-cover", style: { objectFit: "cover" } }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex text-2xl", children: [_jsxs("div", { className: "w-3/6 flex justify-start items-center gap-x-5", children: [_jsxs("div", { className: "flex justify-center items-center gap-x-1", children: [_jsx("button", { onClick: onLikeClick, children: userHasLiked ? (_jsx("span", { className: "text-red-500", children: _jsx(FaHeart, {}) })) : (_jsx("span", { className: "text-3xl", children: _jsx(CiHeart, {}) })) }), _jsx("p", { children: likes.length })] }), _jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaRegComment, {}) }), _jsx("p", { children: comments.length })] })] }), _jsx("div", { className: "w-3/6 flex justify-end items-center gap-x-2", children: _jsx("span", { onClick: handleSaveUnsavePost, children: userSavedPost ? _jsx(FaBookmark, {}) : _jsx(FaRegBookmark, {}) }) })] }), _jsxs("p", { children: [_jsx("span", { className: "font-bold mr-3", children: post.user?.username }), post.bio] }), post.tags.length > 0 && _jsx("div", { className: "tags", children: post.tags.map((tag, i) => (_jsxs("span", { className: "font-bold", children: ["#", tag] }, i))) }), _jsx(CommentsPage, { postId: postId, comments: comments }), _jsxs("div", { className: "flex items-center gap-x-2 relative", children: [_jsx("textarea", { name: "comment", id: "comment", placeholder: "Add a comment", className: "bg-transparent w-5/6 border-b-[2px] h-8", value: message, onChange: (e) => setMessage(e.target.value) }), _jsx("button", { onClick: () => setShowPicker(!showPicker), className: "bg-blue-500 text-white px-4 py-2 rounded-md", children: _jsx(FaRegSmile, {}) }), showPicker && (_jsx("div", { className: "absolute bottom-10", children: _jsx(EmojiPicker, { onEmojiClick: addEmoji }) })), message !== "" && (_jsx("span", { className: "text-white font-bold cursor-pointer", onClick: handleCreateComment, children: loading ? "posting" : "post" }))] })] })] }));
};
export default Post;
