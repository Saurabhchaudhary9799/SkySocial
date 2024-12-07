import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const SuggestedPeople = () => {
    const { user } = useUser();
    const [suggestedPeople, setSuggestedPeople] = useState([]);
    const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
    useEffect(() => {
        const fetchSuggestedPeople = async () => {
            try {
                const userData = localStorage.getItem("userData");
                const authToken = userData ? JSON.parse(userData).authToken : null;
                const response = await axios.get(`${BASE_URL}/api/v1/users/suggested-people`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                // console.log(response);
                setSuggestedPeople(response.data);
                // console.log(suggestedPeople);
            }
            catch (error) {
                console.log(error);
            }
        };
        fetchSuggestedPeople();
    }, [user]);
    return (_jsxs("div", { className: "mx-auto space-y-5", children: [_jsx("h1", { className: "text-center", children: "Suggested People" }), _jsx("div", { className: "grid grid-cols-2 gap-2 ", children: suggestedPeople.map((people, i) => (_jsxs(Link, { to: `/${people.id}`, className: "flex flex-col justify-center items-center  py-2 gap-y-2  rounded bg-gray-200 text-black", children: [_jsxs(Avatar, { className: "flex justify-center items-center", children: [_jsx(AvatarImage, { className: "w-24 h-24 rounded-[50%]", src: people.profile_image }), _jsx(AvatarFallback, { children: "CN" })] }), _jsx("span", { children: people.username })] }, i))) })] }));
};
export default SuggestedPeople;
