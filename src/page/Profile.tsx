import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserPosts from "@/components/UserPosts";
import SavedPosts from "@/components/SavedPosts";
import { EditProfile } from "@/components/EditProfile";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdatePassword } from "@/components/UpdatePassword";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog"; // Ensure you import Dialog components
import CircleLoader from "@/components/CircleLoader";
import { MdDelete } from "react-icons/md";

interface Comment {
  _id: string;
  post: string;
}

interface Like {
  _id: string;
  post: string;
}

interface User {
  id: string;
  name: string;
  username: string;
  profile_image: string;
  cover_image: string;
  bio: string;
  posts: {
    id: string;
    image: string;
    comments: Comment[];
    likes: Like[];
  }[];
  savedPosts: {
    _id: string;
    post: {
      id:string;
      image: string;
      comments: Comment[];
      likes: Like[];
    };
  }[];
  followers: {
    follower: string;
  }[];
  followings: {
    following: string;
  }[];
}

const Profile = () => {
  const { user } = useUser();
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState<string>("posts");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem("userData");
        const authToken = userData ? JSON.parse(userData).authToken : null;
        const response = await axios.get(
          `http://13.232.21.29:8000/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserProfile(response.data.user);
      } catch (error) {
        toast.error("failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUserProfile = (type: string, postId: string) => {
    if (type === "deletePost") {
      setUserProfile({
        ...userProfile!,
        posts: userProfile!.posts.filter((post) => post.id !== postId),
      });
    } else if (type === "removeFromSave") {
      setUserProfile({
        ...userProfile!,
        savedPosts: userProfile!.savedPosts.filter(saved => saved.post.id !== postId)
      });
    }
  };

  const handleDelete = async (postId:string) => {
    try {
     
     const userData = localStorage.getItem("userData");
     const authToken = userData ? JSON.parse(userData).authToken : null;
     const response = await axios.delete(
       `http://13.232.21.29:8000/api/v1/posts/${postId}/save`,
       {
         headers: {
           Authorization: `Bearer ${authToken}`,
         },
       }
     );

     if(response.data.status === "success"){
        toast.success("post unsaved successfully")
     }
     updateUserProfile("removeFromSave",postId)
    //  setLoading(false)
    } catch (error:any) {
       toast.error(`Error ${error.message}`)
    }
}

  return (
    <section className="profile-section md:px-8">
      <div className="container mx-auto px-4 py-5 space-y-5 relative">
        {/* Avatar and Modal Trigger */}
        <div className="flex flex-col lg:flex-row justify-between gap-y-5">
          <div className="flex gap-x-5">
            {/* Avatar Div to Open Modal */}
            <div
              className="cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Avatar className="h-16 w-16 sm:h-24 sm:w-24 md:w-32 md:h-32">
                <AvatarImage src={user?.profile_image} alt="profile image" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-3">
              <div className="space-x-2">
                <span>{user?.username}</span>
              </div>
              <div className="w-48 md:w-80">
                <p>{user?.bio}</p>
              </div>
              <div className="space-x-2">
                <span>{userProfile?.posts.length} posts</span>
                <span>{userProfile?.followers.length} followers</span>
                <span>{userProfile?.followings.length} following</span>
              </div>
              <div>
                <span>{userProfile?.name}</span>
              </div>
            </div>
          </div>
          <div className="space-x-5">
            <EditProfile />
            <UpdatePassword />
          </div>
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 " />
          <DialogContent
            className="bg-white rounded-lg p-5 max-w-sm mx-auto text-center text-black"
            aria-label="Avatar Modal"
          >
            {/* <h2 className="text-lg font-semibold mb-4">Profile Image</h2> */}
            <Avatar className="h-48 w-48 sm:h-64 sm:w-64 mx-auto">
              <AvatarImage src={user?.profile_image} alt="profile image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {/* <Button
              className="mt-4"
              onClick={() => setIsModalOpen(false)} // Close modal on button click
            >
              Close
            </Button> */}
          </DialogContent>
        </Dialog>

        {/* User Posts and Saved Posts */}
        <div>
          <div className="flex justify-start items-center gap-x-8 pt-3 mb-3">
            <div
              onClick={() => setIsActive("posts")}
              className={`cursor-pointer relative ${
                isActive === "posts" ? "text-gray-400" : "text-white"
              }`}
            >
              Posts
              <span
                className={`absolute left-0 right-0 bottom-[-2px] h-[2px] bg-white transition-all duration-500 ${
                  isActive === "posts" ? "w-full " : "w-0"
                }`}
              ></span>
            </div>
            <div
              onClick={() => setIsActive("saved")}
              className={`cursor-pointer relative ${
                isActive === "saved" ? "text-gray-400" : "text-white"
              }`}
            >
              Saved
              <span
                className={`absolute left-0 right-0 bottom-[-2px] h-[2px] bg-white transition-all duration-500 ${
                  isActive === "saved" ? "w-full " : "w-0"
                }`}
              ></span>
            </div>
          </div>
          {isActive === "posts" ? (
            loading ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                <Skeleton className=" h-48 bg-gray-200" />
                <Skeleton className="  h-48 bg-gray-200" />
                <Skeleton className=" h-48 bg-gray-200" />
                <Skeleton className=" h-48 bg-gray-200" />
              </div>
            ) : (
              <UserPosts
                posts={userProfile?.posts || []}
                updateUserProfile={updateUserProfile}
              />
            )
          ) : loading ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
              <Skeleton className=" h-48 bg-gray-200" />
              <Skeleton className="  h-48 bg-gray-200" />
              <Skeleton className=" h-48 bg-gray-200" />
              <Skeleton className=" h-48 bg-gray-200" />
            </div>
          ) : (
            <div className="saved-posts grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">

              {userProfile?.savedPosts.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full">
          No saved posts yet.
        </div>
      ) : ( userProfile?.savedPosts?.map((savedPost) => (
                <div key={savedPost._id} className="saved-post-card ">
                  <img
                    src={savedPost.post?.image}
                    alt="Saved Post"
                    className="w-full h-auto object-cover mb-2"
                  />
                  <div className="flex justify-between">
                    <div className="flex gap-x-5">
                      <div className="flex justify-center items-center gap-x-2">
                        <span>
                          <FaRegComment />
                        </span>{" "}
                        {savedPost.post?.comments.length}
                      </div>
                      <div className="flex justify-center items-center gap-x-2">
                        <span>
                          <FaHeart />
                        </span>{" "}
                        {savedPost.post?.likes.length}{" "}
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleDelete(savedPost.post?.id)}
                    >
                      {" "}
                      {loading ? (
                        <CircleLoader />
                      ) : (
                        <span>
                          <MdDelete />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
