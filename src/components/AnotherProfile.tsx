import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/userContext";
import { FaRegComment, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CircleLoader from "@/components/CircleLoader";
import { Dialog, DialogOverlay, DialogContent } from "@/components/ui/dialog";

interface Comment {
  _id: string;
  post: string;
}

interface Like {
  _id: string;
  post: string;
}

interface Post {
  id: string;
  image: string;
  comments: Comment[];
  likes: Like[];
}

interface User {
  id: string;
  name: string;
  username: string;
  profile_image: string;
  cover_image: string;
  bio: string;
  posts: Post[];
  followers: {
    follower: string;
  }[];
  followings: {
    following: string;
  }[];
}

const AnotherProfile = () => {
  const { user, updateUser } = useUser();
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        toast.error("User ID is missing");
        return;
      }
      try {
        const userData = localStorage.getItem("userData");
        const authToken = userData ? JSON.parse(userData).authToken : null;
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/v1/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserProfile(response.data.user);
        setIsFollowing(
          user?.followings.some((f) => f.following === userId) || false
        );
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [userId, user]);

  const handleFollowAndUnfollow = async () => {
    if (!userId || !user) {
      toast.error("Unable to follow/unfollow. Please try again later.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/v1/users/${userId}/follower`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      );

      if (response?.data.message === "Followed successfully") {
        setIsFollowing(true);
        updateUser({
          ...user,
          followings: [...user.followings, { following: userId }],
        });
      } else {
        setIsFollowing(false);
        updateUser({
          ...user,
          followings: user.followings.filter((f) => f.following !== userId),
        });
      }
    } catch (error: any) {
      toast.error("Error:", error.message);
    }
  };

  return (
    <section className="profile-section  md:px-8">
      <div className="container mx-auto px-4 py-5 space-y-5 relative">
        {/* Cover Image */}
        {/* <div>
          <img
            className="h-48 w-full object-cover rounded"
            src={userProfile?.cover_image}
            alt=""
          />
        </div> */}

        {/* Details */}
        <div className="flex gap-x-5 cursor-pointer">
          <div onClick={() => setIsModalOpen(true)}>
            <Avatar className="w-32 h-32">
              <AvatarImage src={userProfile?.profile_image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-3">
            <div className="space-x-2">
              <span>{userProfile?.username}</span>
              <Button
                onClick={handleFollowAndUnfollow}
                variant={isFollowing ? "outline" : "default"}
                className="bg-white text-black hover:bg-white"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
            <div className="w-48 md:w-80">
              <p>{userProfile?.bio}</p>
            </div>
            <div className="space-x-2">
              <span>{userProfile?.posts?.length || 0} posts</span>
              <span>{userProfile?.followers.length || 0} followers</span>
              <span>{userProfile?.followings.length || 0} following</span>
            </div>
            <div>
              <span>{userProfile?.name}</span>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 " />
          <DialogContent
            className="bg-white rounded-lg p-5 max-w-sm mx-auto text-center text-black"
            aria-label="Avatar Modal"
          >
            {/* <h2 className="text-lg font-semibold mb-4">Profile Image</h2> */}
            <Avatar className="h-48 w-48 sm:h-64 sm:w-64 mx-auto">
              <AvatarImage
                src={userProfile?.profile_image}
                alt="profile image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DialogContent>
        </Dialog>

        {/* Post */}
        <div>
          <div className="flex justify-start items-center gap-x-8 pt-3 mb-3">
            <div>Posts</div>
          </div>
          <section className="post-section py-5">
            {userProfile?.posts && userProfile.posts.length > 0 ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {userProfile.posts.map((post) => (
                  <div key={post.id} className="saved-post-card">
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-auto object-cover mb-2"
                    />

                    <div className="flex justify-between">
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
                        {post.likes.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span>No posts yet</span>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default AnotherProfile;
