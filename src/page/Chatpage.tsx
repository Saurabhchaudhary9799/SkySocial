import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeElapsed } from "@/utils/timeUtils";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import UserChatSection from "@/components/UserChatSection";
// import { io ,Socket} from "socket.io-client";
import { socket } from "@/Config/socketConfig";
import { toast } from "sonner";
import { useUser } from "@/context/userContext";
import CryptoJS from 'crypto-js';

interface People {
  user: {
    id: string;
    username: string;
    profile_image: string;
  };
  lastMessage: {
    message: string;
    createdAt: string;
    sender: {
      id: string;
    };
  };
}

// const socket:Socket = io("http://localhost:8000", {
//   withCredentials: true,
// });

const secretKey:string = "your-secret-base-key";

const Chatpage = () => {
  const { user } = useUser();
  const [friends, setFriends] = useState<People[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [receiver, setReceiver] = useState<{
    id: string;
    username: string;
    profile_image: string;
  } | null>(null);
  const [showChatSection, setShowChatSection] = useState(false);
  
 
    const decrypt = (encryptedText: string): string => {
      try {
        // console.log("Decrypting with key:", secretKey);

        const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        // console.log("Decrypted text:", decryptedText);
        return decryptedText;
      } catch (error) {
        console.error("Decryption failed:", error);
        return encryptedText; // Return original if decryption fails
      }
    };

   

  const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL :import.meta.env.VITE_PRODURL 

  const updateFriends = async (
    receiverId: string,
    lastMessage: string,
    timestamp: string
  ) => {
    // console.log('lastMessage',lastMessage)
    const decryptedMessage = decrypt(lastMessage);
    // console.log('decryptedMessage',decryptedMessage)
    setFriends((prevFriends) => {
      const existingFriendIndex = prevFriends.findIndex(
        (friend) => friend.user.id === receiverId
      );

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
      } else {
        // Add new friend
        const newFriend: People = {
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

        const response = await axios.get(
          `${BASE_URL}/api/v1/users/listPeople`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        // Check if response data is what you expect
        // console.log("Response Data: ", response.data.users);

        // Set the friends state
        setFriends(response.data.users);
      } catch (error: any) {
        console.error(error.message);
        setError(error.message);
      } finally {
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
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/search-user`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      // console.log(response.)
      if (response.status === 200) {
        // console.log(response)
        const { id, profile_image, username } = response.data.result[0];
        setReceiver({ id, profile_image, username });
        setShowChatSection(true);
        // console.log("Receiver set:", { id, profile_image, username });
      } else {
        toast("user not found");
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleBackClick = () => {
    setShowChatSection(false);
    setReceiver(null);
  };

  return (
    <div className="chat-section mx-auto p-4 ">
      <div className="container  mx-auto flex flex-col md:flex-row gap-y-5 md:gap-x-5">
        <div className=" md:h-[500px] rounded bg-gray-800 w-full md:w-80 p-2 space-y-3">
          <div className="flex w-full md:max-w-sm items-center space-x-2 ">
            <Input
              type="text"
              placeholder="search user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <Separator className="hidden md:block" />

          <div className="hidden md:block overflow-y-auto md:h-96">
            {loading ? (
              <div className="flex flex-col gap-y-5">
                <Skeleton className="w-full h-[50px] rounded bg-gray-300" />
                <Skeleton className="w-full h-[50px] rounded bg-gray-300" />
                <Skeleton className="w-full h-[50px] rounded bg-gray-300" />
                <Skeleton className="w-full h-[50px] rounded bg-gray-300" />
                <Skeleton className="w-full h-[50px] rounded bg-gray-300" />
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend, i) => (
                  <div
                    key={i}
                    className="flex gap-x-5  items-center w-full h-[50px] rounded border px-2 cursor-pointer"
                    onClick={() =>
                      setReceiver({
                        id: friend.user.id,
                        username: friend.user.username,
                        profile_image: friend.user.profile_image,
                      })
                    }
                  >
                    <div>
                      <Avatar>
                        <AvatarImage
                          className="w-8 h-8 rounded-[50%]"
                          src={friend?.user.profile_image}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col ">
                      <span className="font-bold text-lg">
                        {friend?.user.username}
                      </span>
                      <div>
                        <span className="text-sm">
                          {friend?.lastMessage.sender.id === user?.userid
                            ? "You"
                            : "friend"}{" "}
                          :
                          {friend?.lastMessage.message.length > 15
                            ? `${friend?.lastMessage.message.substring(
                                0,
                                10
                              )}...`
                            : friend?.lastMessage.message}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className=" flex-1 rounded bg-gray-800">
          <UserChatSection
            receiver={receiver}
            socket={socket}
            updateFriends={updateFriends}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatpage;
