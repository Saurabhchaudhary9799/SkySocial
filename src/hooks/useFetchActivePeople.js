import { BASE_URL, socket } from '@/Config/socketConfig';
import { useUser } from '@/context/userContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
const useFetchActivePeople = () => {
    const { user } = useUser();
    const [activePeople, setActivePeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const userId = user?.userid;
    useEffect(() => {
        socket.emit("user-joined", userId);
        socket.on("active-people", async (data) => {
            const fetchActivePeople = async () => {
                try {
                    setLoading(true);
                    const userData = localStorage.getItem("userData");
                    const authToken = userData ? JSON.parse(userData).authToken : null;
                    const response = await axios.post(`${BASE_URL}/api/v1/users/active-people/${userId}`, data, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    });
                    // console.log(response)
                    if (response.statusText === "OK") {
                        setActivePeople(response.data.activePeople);
                    }
                    // console.log(activePeople);
                    setLoading(false);
                }
                catch (error) {
                    setError(error.message);
                    console.error("Failed to fetch messages:", error);
                }
            };
            fetchActivePeople();
        });
        return () => {
            socket.off("active-people"); // Clean up the listener
        };
    }, [userId]);
    return { activePeople, loading, error };
};
export default useFetchActivePeople;
