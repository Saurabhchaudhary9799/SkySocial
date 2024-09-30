import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import { usePostContext } from "@/context/PostContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Divide } from "lucide-react";

const Posts: React.FC = () => {
  const { posts, loading, error } = usePostContext();
console.log(posts)
  if (loading)
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 bg-gray-200" />
              <Skeleton className="h-4 w-48 bg-gray-200" />
            </div>
          </div>
          <div>
            <Skeleton className="w-full h-64 md:h-96 bg-gray-200" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-gray-200" />
            <Skeleton className="h-4 w-32  bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="h-4  w-full bg-gray-200" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-x-2">
            <Skeleton className="h-16 w-16 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 bg-gray-200" />
              <Skeleton className="h-4 w-48 bg-gray-200" />
            </div>
          </div>
          <div>
            <Skeleton className="w-full h-64 md:h-96 bg-gray-200" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-gray-200" />
            <Skeleton className="h-4 w-32  bg-gray-200" />
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="h-4  w-full bg-gray-200" />
          </div>
        </div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul className="space-y-5">
        {posts?.length > 0  ?
          posts.map((post) => (
            <div key={post._id} className="bg-gray-800 rounded-xl p-4">
              <Post post={post} />
            </div>
          )) : <div className="bg-gray-800 rounded-xl py-4 px-8 sm:px-16 text-center"><p>"You're not following anyone yet. Explore users and start following them to see posts in your feed!"</p></div>}
      </ul>
    </div>
  );
};

export default Posts;
