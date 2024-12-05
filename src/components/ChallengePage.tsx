import React, { useEffect } from "react";
import LivePeople from "./LivePeople";
import StartGamePage from "./StartGamePage";
import { socket } from "@/Config/socketConfig";
import { toast } from "sonner";
import { IoNotifications } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Notification {
  sender:string;
  receiverId:string;
  receiver:string;
  message: string;
}

interface rejectNotification {
  message:string;
}

const ChallengePage = () => {
  const navigate =useNavigate();
  useEffect(() => {
    // Add listener for 'acceptInvite' event
    const handleAcceptInvite = (notification: Notification) => {
      console.log("Received notification:", notification); // Debug log

      toast(
        <div className="space-y-2">
          <p>{notification.message}</p>
          <div className="flex gap-x-2">
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              onClick={() => {
                socket.emit("join-room", {
                  roomId: notification.sender, // Use sender's ID as room ID
                  sender: notification.receiverId,
                  receiver: notification.sender,
                });
                // navigate(`/custom-challenges/tic-tac-toe/${notification.sender}`)
                toast.dismiss(); // Close the toast
              }}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              onClick={() => {
                socket.emit("reject-invite",{receiver:notification.sender,sender:notification.receiver});
                toast.dismiss(); // Close the toast
              }}
            >
              Reject
            </button>
          </div>
        </div>,
        { duration: 5000 } // Keeps the toast visible until the user interacts
      );
    };

    socket.on("acceptInvite", handleAcceptInvite);

  
    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up acceptInvite listener");
      socket.off("acceptInvite", handleAcceptInvite);
      
    };
  }, []);

  useEffect(()=>{
    const handleRejectInvite = (notification:rejectNotification) => {
      toast(notification.message);
    }
    socket.on("rejectInvite",handleRejectInvite);
      
    return () => {
      console.log("Cleaning up acceptInvite listener");
    
      socket.off("rejectInvite", handleRejectInvite);
    };
  },[])

  useEffect(() => {
    const handleRoomJoin = (roomId: string) => {
      navigate(`/custom-challenges/tic-tac-toe/${roomId}`);
    };

    socket.on("room-join", handleRoomJoin);

    return () => {
      console.log("Cleaning up room-join listener");
      socket.off("room-join", handleRoomJoin);
    };
  }, []);

  return (
    <div className="challenge-section container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4">
        <div className="hidden md:block md:col-span-3 lg:col-span-3 space-y-5 border rounded-xl ">
          <LivePeople />
        </div>
        <div className="col-span-1 md:col-span-9 lg:col-span-9 rounded-xl space-y-5 border">
          <StartGamePage />
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
