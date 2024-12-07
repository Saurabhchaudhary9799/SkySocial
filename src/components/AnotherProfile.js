import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";
const AnotherProfile = () => {
    const { user, updateUser } = useUser();
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    // console.log(BASE_URL);
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                toast.error("User ID is missing");
                return;
            }
            try {
                const userData = localStorage.getItem("userData");
                const authToken = userData ? JSON.parse(userData).authToken : null;
                const response = await axios.get(`${BASE_URL}/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUserProfile(response.data.user);
                setIsFollowing(user?.followings.some((f) => f.following === userId) || false);
            }
            catch (error) {
                toast.error("Failed to fetch user data");
            }
        };
        fetchUser();
    }, [userId, user]);
    const handleFollowAndUnfollow = async () => {
        if (!userId || !user) {
            toast.error("Unable to follow/unfollow. Please try again later.");
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/users/${userId}/follower`, {}, {
                headers: {
                    Authorization: `Bearer ${user?.authToken}`,
                },
            });
            if (response?.data.message === "Followed successfully") {
                setIsFollowing(true);
                updateUser({
                    ...user,
                    followings: [...user.followings, { following: userId }],
                });
            }
            else {
                setIsFollowing(false);
                updateUser({
                    ...user,
                    followings: user.followings.filter((f) => f.following !== userId),
                });
            }
        }
        catch (error) {
            toast.error("Error:", error.message);
        }
    };
    return (_jsx("section", { className: "profile-section  md:px-8", children: _jsxs("div", { className: "container mx-auto px-4 py-5 space-y-5 relative", children: [_jsxs("div", { className: "flex gap-x-5 cursor-pointer", children: [_jsx("div", { onClick: () => setIsModalOpen(true), children: _jsxs(Avatar, { className: "w-32 h-32", children: [_jsx(AvatarImage, { src: userProfile?.profile_image }), _jsx(AvatarFallback, { children: "CN" })] }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-x-2", children: [_jsx("span", { children: userProfile?.username }), _jsx(Button, { onClick: handleFollowAndUnfollow, variant: isFollowing ? "outline" : "default", className: "bg-white text-black hover:bg-white", children: isFollowing ? "Unfollow" : "Follow" })] }), _jsx("div", { className: "w-48 md:w-80", children: _jsx("p", { children: userProfile?.bio }) }), _jsxs("div", { className: "space-x-2", children: [_jsxs("span", { children: [userProfile?.posts?.length || 0, " posts"] }), _jsxs("span", { children: [userProfile?.followers.length || 0, " followers"] }), _jsxs("span", { children: [userProfile?.followings.length || 0, " following"] })] }), _jsx("div", { children: _jsx("span", { children: userProfile?.name }) })] })] }), _jsxs(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: [_jsx(DialogOverlay, { className: "fixed inset-0 bg-black bg-opacity-50 " }), _jsx(DialogContent, { className: "bg-white rounded-lg p-5 max-w-sm mx-auto text-center text-black", "aria-label": "Avatar Modal", children: _jsxs(Avatar, { className: "h-48 w-48 sm:h-64 sm:w-64 mx-auto", children: [_jsx(AvatarImage, { src: userProfile?.profile_image, alt: "profile image" }), _jsx(AvatarFallback, { children: "CN" })] }) })] }), _jsxs("div", { children: [_jsx("div", { className: "flex justify-start items-center gap-x-8 pt-3 mb-3", children: _jsx("div", { children: "Posts" }) }), _jsx("section", { className: "post-section py-5", children: userProfile?.posts && userProfile.posts.length > 0 ? (_jsx("div", { className: "grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4", children: userProfile.posts.map((post) => (_jsxs("div", { className: "saved-post-card", children: [_jsx("img", { src: post.image, alt: "Post", className: "w-full h-auto object-cover mb-2" }), _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaRegComment, {}) }), " ", post.comments.length] }), _jsxs("div", { className: "flex justify-center items-center gap-x-2", children: [_jsx("span", { children: _jsx(FaHeart, {}) }), " ", post.likes.length] })] })] }, post.id))) })) : (_jsx("span", { children: "No posts yet" })) })] })] }) }));
};
export default AnotherProfile;
