import { BASE_URL, socket } from '@/Config/socketConfig';
import { useUser } from '@/context/userContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface ActivePeople {
  
    bio: string;
    cover_image: string;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    profile_image: string;
    username: string;
    __v: number;
    _id: string;
  
}

const useFetchActivePeople = () => {
  const { user } = useUser();
  const [activePeople,setActivePeople] = useState<ActivePeople[]>([]);
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

  return {activePeople,loading,error}
}

export default useFetchActivePeople