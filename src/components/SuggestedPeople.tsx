import { useUser } from "@/context/userContext";
import { Button } from "@headlessui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface User {
  id: string;
  username: string;
  profile_image: string;
}

const SuggestedPeople = () => {
  const {user} = useUser()
  const [suggestedPeople, setSuggestedPeople] = useState<User[]>([]);

  const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL :import.meta.env.VITE_PRODURL 


  useEffect(() => {
    const fetchSuggestedPeople = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const authToken = userData ? JSON.parse(userData).authToken : null;

        const response = await axios.get(
          `${BASE_URL}/api/v1/users/suggested-people`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // console.log(response);
        setSuggestedPeople(response.data);
        // console.log(suggestedPeople);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedPeople();
  }, [user]);
  return (
    <div className="mx-auto space-y-5">
      <h1 className="text-center">Suggested People</h1>
      <div className="grid grid-cols-2 gap-2 ">
        {suggestedPeople.map((people, i) => (
          <Link
            key={i}
            to={`/${people.id}`}
            className="flex flex-col justify-center items-center  py-2 gap-y-2  rounded bg-gray-200 text-black"
          >
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                className="w-24 h-24 rounded-[50%]"
                src={people.profile_image}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{people.username}</span>
            {/* <Button className=" text-black bg-gray-200 px-2 py-1 rounded">
              Follow
            </Button> */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPeople;
