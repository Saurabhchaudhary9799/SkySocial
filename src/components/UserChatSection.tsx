import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@/context/userContext";
import axios from "axios";
import { Socket } from "socket.io-client";
import { FaRegSmile } from "react-icons/fa";
import { format } from "date-fns";
import CryptoJS from "crypto-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Dice1 } from "lucide-react";

interface ChatSectionProps {
  receiver: {
    id: string;
    username: string;
    profile_image: string;
  } | null;
  socket: Socket;
  updateFriends: (
    receiverId: string,
    lastMessage: string,
    timestamp: string
  ) => void; // Add this prop
}

class EncryptionService {
  private secretKey: string;

  constructor(secretKey: string) {
    // Use a more secure key generation method in production
    // this.secretKey = CryptoJS.lib.WordArray.random(256/8).toString();
    this.secretKey = secretKey;
  }

  // Encrypt message with support for emojis
  encrypt(text: string): string {
    // console.log('encrypt',this.secretKey);
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  // Decrypt message, handling potential emoji encryption
  decrypt(encryptedText: string): string {
    try {
      // console.log('decrypt',this.secretKey);
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
      // console.log(bytes)

      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return encryptedText; // Return original if decryption fails
    }
  }

  // Generate a shareable encryption key
  generateShareableKey(): string {
    return this.secretKey;
  }

  // Validate and set a shared key
  setSharedKey(sharedKey: string): void {
    this.secretKey = sharedKey;
  }
}

// const socket = io("http://localhost:8000", {
//   withCredentials: true,
// });

const formatTime = (dateString: any) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(date);
};

const groupMessagesByDate = (messages: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  messages.forEach((msg) => {
    const date = format(new Date(msg.createdAt), "yyyy-MM-dd"); // Group by the day
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(msg);
  });

  return grouped;
};

const UserChatSection: React.FC<ChatSectionProps> = ({
  receiver,
  socket,
  updateFriends,
}) => {
  const { user } = useUser();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const userId = user?.userid;
  const receiverId = receiver?.id;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // console.log(receiverId);
  //   console.log(userId);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  
  const encryptionService = new EncryptionService(import.meta.env.VITE_GEMINI_SECRET);

  const addEmoji = (emojiObject: any) => {
    // console.log(emojiObject.emoji);
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append the selected emoji to the message
  };

  const BASE_URL =
    import.meta.env.VITE_ENV === "development"
      ? import.meta.env.VITE_BASEURL
      : import.meta.env.VITE_PRODURL;

  useEffect(() => {
    socket.emit("user-joined", userId);
    // console.log("hello");
    socket.on("receive-message", async (data) => {
      if (data.senderId === receiver?.id || data.receiverId === userId) {
       
        const decryptedMessage = encryptionService.decrypt(data.message);
        
        await fetchMessages();
        updateFriends(data.senderId, data.message, data.timestamp);
      }
    });
    return () => {
      socket.off("receive-message"); // Clean up the listener
    };
    // return () => {
    //   socket.disconnect();
    // };
  }, [userId, receiverId]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchMessages();
      // console.log("hello");
    };
    fetchData();
  }, [receiverId]);

  const fetchMessages = async () => {
    if (!receiver || !userId) return;
    try {
      const userData = localStorage.getItem("userData");
      const authToken = userData ? JSON.parse(userData).authToken : null;
      const response = await axios.get(
        `${BASE_URL}/api/v1/users/${receiver.id}/message`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const decryptedMessages = response.data.result.allMessages.map(
        (msg: any) => ({
          ...msg,
          message: encryptionService.decrypt(msg.message),
        })
      );
      // console.log(decryptedMessages);
      setMessages(decryptedMessages);
      // console.log(response);
      // setMessages(response.data.result.allMessages);
      // console.log(messages); // Assuming the messages are in `response.data.messages`
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    // console.log('senderId :' , userId , "receiverId :" , receiver?.id , "message :" , message)
    if (!message.trim() || !receiver || !userId) return;
    try {
      const userData = localStorage.getItem("userData");
      const authToken = userData ? JSON.parse(userData).authToken : null;

      const timestamp = new Date().toISOString();
      //   console.log('senderId :' , userId , "receiverId :" , receiver.id , "message :" , message)
      const encryptedMessage = encryptionService.encrypt(message);
      socket.emit("send-message", {
        senderId: userId,
        receiverId: receiver.id,
        message: encryptedMessage,
        timestamp,
      });

      await axios.post(
        `${BASE_URL}/api/v1/users/${receiver.id}/message`,
        {
          senderId: userId,
          receiverId: receiver.id,
          message: encryptedMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Fetch updated messages
      await fetchMessages();
console.log(encryptedMessage);
      updateFriends(receiver.id, encryptedMessage, timestamp);
      // Clear input after sending
      setMessage("");
    } catch (error) {}
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = groupMessagesByDate(messages);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSuggest = async () => {
    if (!prompt.trim()) return;

    const answerType =
      "Create a list of three open-ended and engaging suggestions formatted as a single string for a given prompt. Each suggestion should be separated by '||'. These suggestions are for a chat functionality in social media application ";
    // For example, your output should be structured like this: 'What&apos;s a hobby you&apos;ve recently started?|| If you could have dinner with any historical figure, who would it be?||&apos;s a simple thing
    const newPrompt = prompt + answerType;

    // setPrompt(newPrompt)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContentStream(newPrompt);
      // console.log('result',result)
      let resultText = "";
      for await (const chunk of result.stream) {
        resultText += chunk.text();
      }
      // console.log('result text',resultText)
      const ideas = resultText.split("||").slice(0, 3); // Process the response
      setSuggestions(ideas);
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
    }
  };

  return (
    <section className="user-chats flex flex-col  h-[500px] pb-4">
      {receiver ? (
        <div className="border-b-2 flex gap-x-2 pb-2 items-start pl-2 bg-gray-200 py-2">
          <Avatar>
            <AvatarImage
              className="w-8 h-8 rounded-[50%]"
              src={receiver.profile_image}
            />
            <AvatarFallback>{receiver.username}</AvatarFallback>{" "}
          </Avatar>
          <span className="text-black">{receiver.username}</span>
        </div>
      ) : (
        <div className="border-b-2 flex gap-x-2 py-1 items-center pl-2 bg-gray-200 text-black ">
          <span>Select a user to start chatting</span>
        </div>
      )}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-1 p-2"
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="text-center text-gray-500 my-2">
              {format(new Date(date), "MMMM dd, yyyy")}
            </div>
            {groupedMessages[date].map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === userId ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`border inline-block px-2 text-black text-[20px] mb-2 rounded ${
                    msg.sender === userId ? "bg-green-300" : "bg-gray-300"
                  }`}
                >
                  {msg.message}{" "}
                  <span className="text-[10px]">
                    {formatTime(msg.createdAt)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex w-full  items-center space-x-2 px-2 relative">
      <textarea
      placeholder="Start chat"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={1} // Default row count for small height
      className="p-2 rounded"
      style={{
        width: '100%',
        resize: 'none', // Prevent manual resizing
        overflow: 'hidden', // Hide scrollbars
        minHeight: '40px', // Set a minimum height
        fontFamily: 'inherit',
        fontSize: 'inherit',
        color:"black"
      }}
    />

        <button
          onClick={() => setShowPicker(!showPicker)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          <FaRegSmile />
        </button>
        {showPicker && (
          <div className="absolute bottom-10">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
        <button className="w-[100px] border rounded" onClick={toggleModal}>
          Ask 
        </button>

        <Button type="submit" onClick={sendMessage}>
          Send
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white px-6 py-2 rounded-lg w-[90%] sm:w-[400px] text-black">
            <div className=" flex justify-end">
              <span
                className="text-right border px-2 rounded bg-black text-white cursor-pointer"
                onClick={() => {
                  setIsModalOpen(false);
                  setPrompt("");
                  setSuggestions([]);
                }}
              >
                x
              </span>
            </div>
            <h2 className="text-lg font-bold mb-4 text-black text-center">
              What can I suggest you?
            </h2>

            <div className="flex justify-end gap-2">
              <Input
                type="text"
                placeholder="Ask for ideas..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mb-4 text-black"
              />
              {/* <Button
                variant="outline"
                onClick={toggleModal}
                className="text-gray-500"
              >
                Cancel
              </Button> */}
              <Button onClick={handleSuggest}>Suggest</Button>
            </div>
            <div>
              {suggestions.length > 0 &&
                suggestions.map((suggestion, i) => (
                  <div key={i}>
                    {i + 1}. {suggestion}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserChatSection;
