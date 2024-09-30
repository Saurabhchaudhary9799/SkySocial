import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/userContext";

interface User {
  authToken: string;
  userid: string;
  name: string;
  username: string;
  useremail: string;
  bio: string;
  profile_image: string;
  cover_image: string;
  posts: {
    _id: string;
  }[];
  followers: {
    follower: string;
  }[];
  followings: {
    following: string;
  }[];
  // Added posts field
}

const ProfileBox = () => {
  const { user } = useUser();
 
  const userId = user?.userid;

  return (
    <div className="max-w-sm mx-auto bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative">
        <img
          className="w-full h-24 object-cover"
          src={user?.cover_image}
          alt="cover"
        />
        {/* Profile Image */}
        <img
          className="absolute left-4 bottom-[-32px] w-16 h-16 rounded-full border-4 border-white object-cover"
          src={user?.profile_image}
          alt="profile"
        />
      </div>

      {/* Profile Details */}
      <div className="text-center p-4">
        <h2 className="text-lg font-semibold">{user?.name}</h2>
        <p className="text-gray-400 text-sm">@{user?.username}</p>
        <p className="text-sm mt-2">{user?.bio}</p>
      </div>

      {/* Stats */}
      <div className="flex justify-around border-t border-gray-700 py-4">
        <div className="text-center">
          <h3 className="text-lg font-bold">{user?.followings.length}</h3>
          <p className="text-gray-400 text-sm">Following</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">{user?.followers.length}</h3>
          <p className="text-gray-400 text-sm">Followers</p>
        </div>
      </div>

      {/* Profile Button */}
      <div className="text-center pb-4">
        <Link
          to={`/profile/${userId}`}
          className="text-blue-500 hover:underline"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileBox;
