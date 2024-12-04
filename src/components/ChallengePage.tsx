import React, { useEffect, useState } from "react";
import LivePeople from "./LivePeople";
import StartGamePage from "./StartGamePage";
import { socket } from "@/Config/socketConfig";
import { useUser } from "@/context/userContext";
import { BASE_URL } from "@/Config/socketConfig";
import axios from "axios";

const ChallengePage = () => {
  const { user } = useUser();
  const [activePeople,setActivePeople] = useState([]);
  const [loading,setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>("");

  const userId = user?.userid;
  useEffect(() => {
    socket.emit("user-joined", userId);
    socket.on("active-people", async (data) => {
      const fetchActivePeople = async () => {
        try {
          setLoading(true);
          const userData = localStorage.getItem("userData");
          const authToken = userData ? JSON.parse(userData).authToken : null;
          const response = await axios.post(
            `${BASE_URL}/api/v1/users/active-people/${userId}`,data,
            {
              headers: {
               "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,

              },
            }
          );
          // console.log(response)
          if(response.statusText === "OK"){
            setActivePeople(response.data.activePeople)
          }
          // console.log(activePeople);
          setLoading(false)
        } catch (error:any) {
          setError(error.message)
          console.error("Failed to fetch messages:", error);
        }
      };
      fetchActivePeople();
    });
    return () => {
      socket.off("active-people"); // Clean up the listener
    };
  }, [userId]);
  return (
    <div className="challenge-section container mx-auto p-4 ">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4">
        <div className="hidden md:block md:col-span-3 lg:col-span-3  space-y-5 border rounded-xl">
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
