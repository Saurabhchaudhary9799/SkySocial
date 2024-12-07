import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import useFetchActivePeople from "@/hooks/useFetchActivePeople";
import { socket } from "@/Config/socketConfig";
import { useUser } from "@/context/userContext";
const LivePeople = () => {
    const { activePeople, loading, error } = useFetchActivePeople();
    const { user } = useUser();
    // console.log(activePeople);
    const handleInvite = (friend) => {
        // console.log(friend);
        socket.emit("accept-invite", { ...friend, currentUser: user?.username, currentUserId: user?.userid });
    };
    return (_jsxs("div", { className: "active-friends-section px-3 py-2", children: [_jsx("h1", { className: "text-center font-bold mb-2", children: "Active Friends" }), _jsxs("div", { className: "h-96 overflow-y-auto space-y-3", children: [error && _jsx("p", { className: "text-red-500", children: error }), activePeople?.length > 0 &&
                        activePeople.map((people, i) => (_jsxs("div", { className: "active-friend flex justify-between bg-white/30 backdrop-blur-md items-center p-2 rounded ", children: [_jsxs("div", { className: "avatar flex gap-x-2 items-center", children: [_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: people.profile_image }), _jsx(AvatarFallback, { className: "text-black", children: "1ST" })] }), _jsx("span", { children: people.username })] }), _jsx(Button, { onClick: () => handleInvite(people), children: "Invite" })] }, i)))] })] }));
};
export default LivePeople;
