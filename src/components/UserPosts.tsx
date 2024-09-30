import React, { useState, useEffect } from "react";
import { usePostContext, Post } from "@/context/PostContext";
import { useUser } from "@/context/userContext";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import CircleLoader from "./CircleLoader";
interface Comment {
  _id: string;
  post: string;
}

interface Like {
  _id: string;
  post: string;
}

interface UserPostProps {
  posts: {
    id: string;
    image: string;
    comments: Comment[];
    likes: Like[];
  }[];
  updateUserProfile:(type:string,postId:string) => void ;
}



const UserPosts: React.FC<UserPostProps> = ({ posts,updateUserProfile }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async (postId:string) => {
         try {
          setLoading(true);
          const userData = localStorage.getItem("userData");
          const authToken = userData ? JSON.parse(userData).authToken : null;
          const response = await axios.delete(
            `${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if(response.data.status === "success"){
             toast.success("post deleted successfully")
          }
          updateUserProfile("deletePost",postId)
          setLoading(false)
         } catch (error:any) {
            toast.error(`Error ${error.message}`)
         }
  }
  return (
    <section className="post-section py-5">
      {posts.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {posts.map((post) => (
            <div key={post.id} className="saved-post-card ">
              {/* Assuming post has an array, so we render the first one */}

              <img
                src={post.image}
                alt="Saved Post"
                className="w-full h-auto object-cover mb-2"
              />
              <div className="flex justify-between">
              <div className="flex gap-x-5">
                <div className="flex justify-center items-center gap-x-2">
                  <span>
                    <FaRegComment />
                  </span>{" "}
                  {post.comments.length}
                </div>
                <div className="flex justify-center items-center gap-x-2">
                  <span>
                    <FaHeart />
                  </span>{" "}
                  {post.likes.length}{" "}
                </div>
              </div>
              <div className="cursor-pointer" onClick={() => handleDelete(post.id)}> {loading ? <CircleLoader/>:<span><MdDelete/></span>}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>No posts yet</span>
      )}
    </section>
  );
};

export default UserPosts;
