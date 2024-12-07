import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserPosts from "@/components/UserPosts";
import { EditProfile } from "@/components/EditProfile";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePassword } from "@/components/UpdatePassword";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog"; // Ensure you import Dialog components
import CircleLoader from "@/components/CircleLoader";
import { MdDelete } from "react-icons/md";
const Profile = () => {
    const { user } = useUser();
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState("posts");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const userData = localStorage.getItem("userData");
                const authToken = userData ? JSON.parse(userData).authToken : null;
                const response = await axios.get(`${BASE_URL}/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUserProfile(response.data.user);
            }
            catch (error) {
                toast.error("failed to fetch posts");
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);
    const updateUserProfile = (type, postId) => {
        if (type === "deletePost") {
            setUserProfile({
                ...userProfile,
                posts: userProfile.posts.filter((post) => post.id !== postId),
            });
        }
        else if (type === "removeFromSave") {
            setUserProfile({
                ...userProfile,
                savedPosts: userProfile.savedPosts.filter(saved => saved.post.id !== postId)
            });
        }
    };
    const handleDelete = async (postId) => {
        try {
            const userData = localStorage.getItem("userData");
            const authToken = userData ? JSON.parse(userData).authToken : null;
            const response = await axios.delete(`${BASE_URL}/api/v1/posts/${postId}/save`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.data.status === "success") {
                toast.success("post unsaved successfully");
            }
            updateUserProfile("removeFromSave", postId);
            //  setLoading(false)
        }
        catch (error) {
            toast.error(`Error ${error.message}`);
        }
    };
    return (_jsx("section", { className: "profile-section md:px-8", children: _jsxs("div", { className: "container mx-auto px-4 py-5 space-y-5 relative", children: [_jsxs("div", { className: "flex flex-col lg:flex-row justify-between gap-y-5", children: [_jsxs("div", { className: "flex gap-x-5", children: [_jsx("div", { className: "cursor-pointer", onClick: () => setIsModalOpen(true), children: _jsxs(Avatar, { className: "h-16 w-16 sm:h-24 sm:w-24 md:w-32 md:h-32", children: [_jsx(AvatarImage, { src: user?.profile_image, alt: "profile image" }), _jsx(AvatarFallback, { children: "CN" })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "space-x-2", children: _jsx("span", { children: user?.username }) }), _jsx("div", { className: "w-48 md:w-80", children: _jsx("p", { children: user?.bio }) }), _jsxs("div", { className: "space-x-2", children: [_jsxs("span", { children: [userProfile?.posts.length, " posts"] }), _jsxs("span", { children: [userProfile?.followers.length, " followers"] }), _jsxs("span", { children: [userProfile?.followings.length, " following"] })] }), _jsx("div", { children: _jsx("span", { children: userProfile?.name }) })] })] }), _jsxs("div", { className: "space-x-5", children: [_jsx(EditProfile, {}), _jsx(UpdatePassword, {})] })] }), _jsxs(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: [_jsx(DialogOverlay, { className: "fixed inset-0 bg-black bg-opacity-50 " }), _jsx(DialogContent, { className: "bg-white rounded-lg p-5 max-w-sm mx-auto text-center text-black", "aria-label": "Avatar Modal", children: _jsxs(Avatar, { className: "h-48 w-48 sm:h-64 sm:w-64 mx-auto", children: [_jsx(AvatarImage, { src: user?.profile_image, alt: "profile image" }), _jsx(AvatarFallback, { children: "CN" })] }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-start items-center gap-x-8 pt-3 mb-3", children: [_jsxs("div", { onClick: () => setIsActive("posts"), className: `cursor-pointer relative ${isActive === "posts" ? "text-gray-400" : "text-white"}`, children: ["Posts", _jsx("span", { className: `absolute left-0 right-0 bottom-[-2px] h-[2px] bg-white transition-all duration-500 ${isActive === "posts" ? "w-full " : "w-0"}` })] }), _jsxs("div", { onClick: () => setIsActive("saved"), className: `cursor-pointer relative ${isActive === "saved" ? "text-gray-400" : "text-white"}`, children: ["Saved", _jsx("span", { className: `absolute left-0 right-0 bottom-[-2px] h-[2px] bg-white transition-all duration-500 ${isActive === "saved" ? "w-full " : "w-0"}` })] })] }), isActive === "posts" ? (loading ? (_jsxs("div", { className: "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ", children: [_jsx(Skeleton, { className: " h-48 bg-gray-200" }), _jsx(Skeleton, { className: "  h-48 bg-gray-200" }), _jsx(Skeleton, { className: " h-48 bg-gray-200" }), _jsx(Skeleton, { className: " h-48 bg-gray-200" })] })) : (_jsx(UserPosts, { posts: userProfile?.posts || [], updateUserProfile: updateUserProfile }))) : loading ? (_jsxs("div", { className: "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ", children: [_jsx(Skeleton, { className: " h-48 bg-gray-200" }), _jsx(Skeleton, { className: "  h-48 bg-gray-200" }), _jsx(Skeleton, { className: " h-48 bg-gray-200" }), _jsx(Skeleton, { className: " h-48 bg-gray-200" })] })) : (_jsx("div", { className: "saved-posts grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ", children: userProfile?.savedPosts.length === 0 ? (_jsx("div", { className: "text-center text-gray-500 col-span-full", children: "No saved posts yet." })) : (userProfile?.savedPosts?.map((savedPost) => (_jsxs("div", { className: "saved-post-card ", children: [_jsx("img", { src: savedPost.post?.image, alt: "Saved Post", className: "w-full h-auto object-cover mb-2" }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { className: "flex gap-x-5", children: [_jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaRegComment, {}) }), " ", savedPost.post?.comments.length] }), _jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaHeart, {}) }), " ", savedPost.post?.likes.length, " "] })] }), _jsxs("div", { className: "cursor-pointer", onClick: () => handleDelete(savedPost.post?.id), children: [" ", loading ? (_jsx(CircleLoader, {})) : (_jsx("span", { children: _jsx(MdDelete, {}) }))] })] })] }, savedPost._id)))) }))] })] }) }));
};
export default Profile;
