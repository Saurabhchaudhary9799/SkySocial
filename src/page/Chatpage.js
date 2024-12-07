import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UserChatSection from "@/components/UserChatSection";
// import { io ,Socket} from "socket.io-client";
import { socket } from "@/Config/socketConfig";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import CryptoJS from 'crypto-js';
// const socket:Socket = io("http://localhost:8000", {
//   withCredentials: true,
// });
const secretKey = "your-secret-base-key";
const Chatpage = () => {
    const { user } = useUser();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [receiver, setReceiver] = useState(null);
    const [showChatSection, setShowChatSection] = useState(false);
    const decrypt = (encryptedText) => {
        try {
            // console.log("Decrypting with key:", secretKey);
            const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            // console.log("Decrypted text:", decryptedText);
            return decryptedText;
        }
        catch (error) {
            console.error("Decryption failed:", error);
            return encryptedText; // Return original if decryption fails
        }
    };
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    const updateFriends = async (receiverId, lastMessage, timestamp) => {
        // console.log('lastMessage',lastMessage)
        const decryptedMessage = decrypt(lastMessage);
        // console.log('decryptedMessage',decryptedMessage)
        setFriends((prevFriends) => {
            const existingFriendIndex = prevFriends.findIndex((friend) => friend.user.id === receiverId);
            if (existingFriendIndex !== -1) {
                // Update existing friend
                const updatedFriends = [...prevFriends];
                updatedFriends[existingFriendIndex] = {
                    ...updatedFriends[existingFriendIndex],
                    lastMessage: {
                        message: decryptedMessage,
                        createdAt: timestamp,
                        sender: {
                            id: user?.userid ?? "",
                        },
                    },
                };
                return updatedFriends;
            }
            else {
                // Add new friend
                const newFriend = {
                    user: {
                        id: receiverId,
                        username: receiver?.username ?? "",
                        profile_image: receiver?.profile_image ?? "",
                    },
                    lastMessage: {
                        message: decryptedMessage,
                        createdAt: timestamp,
                        sender: {
                            id: user?.userid ?? "",
                        },
                    },
                };
                return [...prevFriends, newFriend];
            }
        });
    };
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                setLoading(true);
                const userData = localStorage.getItem("userData");
                const authToken = userData ? JSON.parse(userData).authToken : null;
                const response = await axios.get(`${BASE_URL}/api/v1/users/listPeople`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                // Check if response data is what you expect
                // console.log("Response Data: ", response.data.users);
                // Set the friends state
                setFriends(response.data.users);
            }
            catch (error) {
                console.error(error.message);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPeople();
    }, []);
    // This will log `friends` after they have been updated
    useEffect(() => {
        // console.log("Friends updated: ", friends);
    }, [friends]);
    const handleSearch = async () => {
        try {
            const userData = localStorage.getItem("userData");
            const authToken = userData ? JSON.parse(userData).authToken : null;
            const response = await axios.post(`${BASE_URL}/api/v1/users/search-user`, { username }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            // console.log(response.)
            if (response.status === 200) {
                // console.log(response)
                const { id, profile_image, username } = response.data.result[0];
                setReceiver({ id, profile_image, username });
                setShowChatSection(true);
                // console.log("Receiver set:", { id, profile_image, username });
            }
            else {
                toast("user not found");
            }
        }
        catch (error) {
            console.error(error.message);
        }
    };
    const handleBackClick = () => {
        setShowChatSection(false);
        setReceiver(null);
    };
    return (_jsx("div", { className: "chat-section mx-auto p-4 ", children: _jsxs("div", { className: "container  mx-auto flex flex-col md:flex-row gap-y-5 md:gap-x-5", children: [_jsxs("div", { className: " md:h-[500px] rounded bg-gray-800 w-full md:w-80 p-2 space-y-3", children: [_jsxs("div", { className: "flex w-full md:max-w-sm items-center space-x-2 ", children: [_jsx(Input, { type: "text", placeholder: "search user", value: username, onChange: (e) => setUsername(e.target.value) }), _jsx(Button, { type: "submit", onClick: handleSearch, children: "Search" })] }), _jsx(Separator, { className: "hidden md:block" }), _jsx("div", { className: "hidden md:block overflow-y-auto md:h-96", children: loading ? (_jsxs("div", { className: "flex flex-col gap-y-5", children: [_jsx(Skeleton, { className: "w-full h-[50px] rounded bg-gray-300" }), _jsx(Skeleton, { className: "w-full h-[50px] rounded bg-gray-300" }), _jsx(Skeleton, { className: "w-full h-[50px] rounded bg-gray-300" }), _jsx(Skeleton, { className: "w-full h-[50px] rounded bg-gray-300" }), _jsx(Skeleton, { className: "w-full h-[50px] rounded bg-gray-300" })] })) : (_jsx("div", { className: "space-y-2", children: friends.map((friend, i) => (_jsxs("div", { className: "flex gap-x-5  items-center w-full h-[50px] rounded border px-2 cursor-pointer", onClick: () => setReceiver({
                                        id: friend.user.id,
                                        username: friend.user.username,
                                        profile_image: friend.user.profile_image,
                                    }), children: [_jsx("div", { children: _jsxs(Avatar, { children: [_jsx(AvatarImage, { className: "w-8 h-8 rounded-[50%]", src: friend?.user.profile_image }), _jsx(AvatarFallback, { children: "CN" })] }) }), _jsxs("div", { className: "flex flex-col ", children: [_jsx("span", { className: "font-bold text-lg", children: friend?.user.username }), _jsx("div", { children: _jsxs("span", { className: "text-sm", children: [friend?.lastMessage.sender.id === user?.userid
                                                                ? "You"
                                                                : "friend", ":", friend?.lastMessage.message.length > 15
                                                                ? `${friend?.lastMessage.message.substring(0, 10)}...`
                                                                : friend?.lastMessage.message] }) })] })] }, i))) })) })] }), _jsx("div", { className: " flex-1 rounded bg-gray-800", children: _jsx(UserChatSection, { receiver: receiver, socket: socket, updateFriends: updateFriends }) })] }) }));
};
export default Chatpage;
