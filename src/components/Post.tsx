import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa6";
import { FaRegBookmark, FaRegSmile } from "react-icons/fa";
import { formatTimeElapsed } from "@/utils/timeUtils";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import CommentsPage from "./CommentsPage";
import { usePostContext } from "@/context/PostContext";
import { useUser } from "@/context/userContext";
import { FaHeart } from "react-icons/fa";
import { socket } from "@/Config/socketConfig";
import EmojiPicker from "emoji-picker-react";
import { FaBookmark } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface PostProps {
  post: {
    _id: string;
    bio: string;
    image: string;
    user: {
      _id: string;
      username: string;
      profile_image: string;

      createdAt: string;
    };
    tags:[string];
    comments: Array<{
      _id: string;
      message: string;
      post: string;
      user: {
        id: string;
        username: string;
        profile_image: string;
      };
      createdAt: string;
    }>;
    likes: {
      _id: string;
      user: string;
      post: string;
    }[];
    createdAt: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { createComment, handleLikes, deletePost } = usePostContext();
  const { user, updateUser } = useUser(); // Get the current logged-in user
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // Track follow/unfollow status
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const postId = post._id;
  const userId = user?.userid; // console.log(post)
 const [userSavedPost ,setUserSavedPost] = useState(false)
  const addEmoji = (emojiObject: any) => {
    // console.log(emojiObject.emoji);
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append the selected emoji to the message
  };

  useEffect(() => {
    // Check if the post's user is already in the current user's followings array
    if (
      user?.followings.some(
        (following) => following.following === post.user?._id
      )
    ) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }

    if(user?.savedPosts.some((savedPost) => savedPost.post === post._id)){
     setUserSavedPost(true)
    }else{
      setUserSavedPost(false)
    }
  }, [user, post.user?._id]);

  const handleCreateComment = async () => {
    try {
      setLoading(true);
      await createComment(message, postId);
      if (post.user?._id !== user?.userid) {
        socket.emit("commentOnPost", {
          userId: post.user?._id,
          username: user?.username,
          postId: post._id,
        });
      }
      setMessage("");
      toast.success("commented successfully!");
    } catch (error: any) {
      toast.error(`error ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const comments = post.comments ?? [];
  const likes = post.likes ?? [];

  const userHasLiked = likes.some((like) => like.user === user?.userid);
  //  console.log(userHasLiked)
  const onLikeClick = async () => {
    try {
      await handleLikes(post._id);

      if (post.user?._id !== user?.userid) {
        socket.emit("likePost", {
          userId: post.user?._id,
          username: user?.username,
          postId: post._id,
          action: !userHasLiked ? "liked" : "unliked",
        });
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post._id);
      toast.success("post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleFollowUnfollow = async (id: string) => {
    try {
      const response = await axios.post(
        `http://13.232.21.29:8000/api/v1/users/${id}/follower`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.authToken}`,
          },
        }
      );

      if (response?.data.message === "Followed successfully") {
        setIsFollowing(true); // Update the follow status
        updateUser({
          ...user!,
          followings: [
            ...user!.followings,
            { following: id }, // Add the new following ID
          ],
        });
      } else {
        setIsFollowing(false); // Update the follow status
        // Handle unfollow by removing the ID from the followings array
        updateUser({
          ...user!,
          followings: user!.followings.filter((f) => f.following !== id),
        });
      }

      if (post.user?._id !== user?.userid) {
        socket.emit("followAndUnfollowUser", {
          userId: post.user?._id,
          username: user?.username,
          postId: post._id,
          action:
            response?.data.message === "Followed successfully"
              ? "followed"
              : "unfollowed",
        });
      }
    } catch (error: any) {
      toast.error("Error is", error.message);
    }
  };

  const handleSaveUnsavePost = async () => {
    try {
      const authToken = user?.authToken;

      const response = await axios.post(
        `http://13.232.21.29:8000/api/v1/posts/${post._id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.message === "Post saved") {
        updateUser({
          ...user!,
          savedPosts: [
            ...(user?.savedPosts || []),
            {
              _id: response.data.save._id, // Assuming the response contains the new saved post's ID
              post: response.data.save.post, // The postId you are saving
              user: response.data.save.user, // Current user's ID
            },
          ],
        });
        setUserSavedPost(true)
      } else if(response.data.message === "Post unsaved") {
        updateUser({
          ...user!,
          savedPosts: user?.savedPosts.filter(savedPost => savedPost.post !== postId) || []
        });
        setUserSavedPost(false)
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center ">
        <Link
          to={`${
            post.user?._id !== user?.userid
              ? `/${post.user?._id}`
              : `/profile/${post.user?._id}`
          }`}
        >
          <div className="flex items-center gap-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.user?.profile_image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm text-gray-300">
              <span>{post.user?.username}</span>
              <span>{formatTimeElapsed(post.createdAt)}</span>
            </div>
          </div>
        </Link>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BsThreeDots />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={`${post.user?._id === user?.userid && "hidden"}`}
                onClick={() => handleFollowUnfollow(post.user?._id)}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${post.user?._id !== user?.userid && "hidden"}`}
                onClick={handleDeletePost}
              >
                Delete Post
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${post.user?._id !== user?.userid && "hidden"}`}
                onClick={handleDeletePost}
              >
                Edit Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="relative w-full pb-[100%] bg-gray-200 overflow-hidden rounded-lg">
        <img
          src={post.image}
          alt="post"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div>
        <div className="flex text-2xl">
          <div className="w-3/6 flex justify-start items-center gap-x-5">
            <div className="flex justify-center items-center gap-x-1">
              <button onClick={onLikeClick}>
                {userHasLiked ? (
                  <span className="text-red-500">
                    <FaHeart />
                  </span>
                ) : (
                  <span className="text-3xl">
                    <CiHeart />
                  </span>
                )}
              </button>
              <p>{likes.length}</p>
            </div>
            <div className="flex justify-center items-center gap-x-2">
              <span>
                <FaRegComment />
              </span>
              <p>{comments.length}</p>
            </div>
          </div>
          <div className="w-3/6 flex justify-end items-center gap-x-2">
            <span onClick={handleSaveUnsavePost}>
              {userSavedPost ? <FaBookmark/>: <FaRegBookmark />}
            </span>
          </div>
        </div>
        <p>
          <span className="font-bold mr-3">{post.user?.username}</span>
          {post.bio}
        </p>
        
           {
            post.tags.length > 0 && <div className="tags">
                 {
                  post.tags.map((tag,i)=>(
                    <span key={i} className="font-bold">#{tag}</span>
                  ))
                 }
            </div>
           }
        
        <CommentsPage postId={postId} comments={comments} />
        <div className="flex items-center gap-x-2 relative">
          <textarea
            name="comment"
            id="comment"
            placeholder="Add a comment"
            className="bg-transparent w-5/6 border-b-[2px] h-8"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

          {message !== "" && (
            <span
              className="text-white font-bold cursor-pointer"
              onClick={handleCreateComment}
            >
              {loading ? "posting" : "post"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
