import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import LivePeople from "./LivePeople";
import StartGamePage from "./StartGamePage";
import { socket } from "@/Config/socketConfig";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const ChallengePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Add listener for 'acceptInvite' event
        const handleAcceptInvite = (notification) => {
            console.log("Received notification:", notification); // Debug log
            toast(_jsxs("div", { className: "space-y-2", children: [_jsx("p", { children: notification.message }), _jsxs("div", { className: "flex gap-x-2", children: [_jsx("button", { className: "bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600", onClick: () => {
                                    socket.emit("join-room", {
                                        roomId: notification.sender, // Use sender's ID as room ID
                                        sender: notification.receiverId,
                                        receiver: notification.sender,
                                    });
                                    // navigate(`/custom-challenges/tic-tac-toe/${notification.sender}`)
                                    toast.dismiss(); // Close the toast
                                }, children: "Accept" }), _jsx("button", { className: "bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600", onClick: () => {
                                    socket.emit("reject-invite", { receiver: notification.sender, sender: notification.receiver });
                                    toast.dismiss(); // Close the toast
                                }, children: "Reject" })] })] }), { duration: 5000 } // Keeps the toast visible until the user interacts
            );
        };
        socket.on("acceptInvite", handleAcceptInvite);
        // Cleanup listener on unmount
        return () => {
            console.log("Cleaning up acceptInvite listener");
            socket.off("acceptInvite", handleAcceptInvite);
        };
    }, []);
    useEffect(() => {
        const handleRejectInvite = (notification) => {
            toast(notification.message);
        };
        socket.on("rejectInvite", handleRejectInvite);
        return () => {
            console.log("Cleaning up acceptInvite listener");
            socket.off("rejectInvite", handleRejectInvite);
        };
    }, []);
    useEffect(() => {
        const handleRoomJoin = (roomId) => {
            navigate(`/custom-challenges/tic-tac-toe/${roomId}`);
        };
        socket.on("room-join", handleRoomJoin);
        return () => {
            console.log("Cleaning up room-join listener");
            socket.off("room-join", handleRoomJoin);
        };
    }, []);
    return (_jsx("div", { className: "challenge-section container mx-auto p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-x-4", children: [_jsx("div", { className: "hidden md:block md:col-span-3 lg:col-span-3 space-y-5 border rounded-xl ", children: _jsx(LivePeople, {}) }), _jsx("div", { className: "col-span-1 md:col-span-9 lg:col-span-9 rounded-xl space-y-5 border", children: _jsx(StartGamePage, {}) })] }) }));
};
export default ChallengePage;
