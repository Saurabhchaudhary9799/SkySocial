import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const CustomChallenge = () => {
  return (
    <div className="max-w-sm mx-auto bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden py-3">
      <h1 className="text-center font-bold mb-3">Custom Challenges</h1>
      <div className="px-3 space-y-3">
        <div className="space-y-2 bg-white/30 backdrop-blur-md  p-2 rounded">
          <div className="flex justify-between items-center">
          <h2>Tic-Tac-Toe</h2>
          <Link to={"/custom-challenges/tic-tac-toe"}  className="text-sm bg-black px-2 py-1 rounded"> Join now</Link>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span>4k+ people joined</span>
              
            </div>
            <div>
            <div className="flex items-center relative">
              {/* Adjusting overlap using negative margins */}
              <div className="-ml-0">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">1ST</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">2ND</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">3RD</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">4TH</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            </div>
          </div>
        </div>
        <div className="space-y-2 bg-white/30 backdrop-blur-md  p-2 rounded">
          <div className="flex justify-between items-center">
          <h2>Rock-Paper-Scissor</h2>
          <Link to={"/custom-challenges/tic-tac-toe"}  className="text-sm bg-black px-2 py-1 rounded"> Join now</Link>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span>4k+ people joined</span>
              
            </div>
            <div>
            <div className="flex items-center relative">
              {/* Adjusting overlap using negative margins */}
              <div className="-ml-0">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">1ST</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">2ND</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">3RD</AvatarFallback>
                </Avatar>
              </div>
              <div className="-ml-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-black">4TH</AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomChallenge;
