import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useFetchActivePeople from "@/hooks/useFetchActivePeople";
import { socket } from "@/Config/socketConfig";
import { useUser } from "@/context/userContext";

const LivePeople = () => {
  const { activePeople, loading, error } = useFetchActivePeople();
const {user} = useUser();

  // console.log(activePeople);
  const handleInvite = (friend:any) => {
    // console.log(friend);
    socket.emit("accept-invite", {...friend ,currentUser:user?.username,currentUserId:user?.userid });
  };
  

  return (
    <div className="active-friends-section px-3 py-2">
      <h1 className="text-center font-bold mb-2">Active Friends</h1>
      <div className="h-96 overflow-y-auto space-y-3">
        {error && <p className="text-red-500">{error}</p>}
        {activePeople?.length > 0 &&
          activePeople.map((people, i) => (
            <div
              key={i}
              className="active-friend flex justify-between bg-white/30 backdrop-blur-md items-center p-2 rounded "
            >
              <div className="avatar flex gap-x-2 items-center">
                <Avatar>
                  <AvatarImage src={people.profile_image} />
                  <AvatarFallback className="text-black">1ST</AvatarFallback>
                </Avatar>
                <span>{people.username}</span>
              </div>
              <Button onClick={() => handleInvite(people)}>Invite</Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LivePeople;
