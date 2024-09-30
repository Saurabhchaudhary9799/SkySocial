import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeElapsed } from "@/utils/timeUtils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { useUser } from "@/context/userContext";
import { usePostContext } from "@/context/PostContext";

interface Comment {
  _id: string;
  message: string;
  post: string;
  user: {
    id: string;
    username: string;
    profile_image: string;
  };
  createdAt: string;
}

interface CommentProps {
  postId: string;
  comments: Comment[];
}

const CommentsPage: React.FC<CommentProps> = ({ postId, comments }) => {
  const { user } = useUser();
  const { deleteComment } = usePostContext();
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // State for dialog open/close

  // Fetch comments when dialog opens
  useEffect(() => {
    if (isOpen) {
      handleShowComments();
    }
  }, [isOpen]);

  const handleShowComments = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("userData");
      const authToken = userData ? JSON.parse(userData).authToken : null;
      // console.log('authToken',authToken);
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setAllComments(response?.data.data);
      console.log(allComments)
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setAllComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)} // Change state based on dialog open/close
      >
        <DialogTrigger asChild>
          <span className="cursor-pointer">
            View all {comments.length} comments
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800">
          <DialogHeader>
            <DialogTitle>See all comments</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p>Loading comments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : allComments.length === 0 ? (
            <p className="text-gray-400">No comments</p>
          ) : (
            <div className="space-y-3 h-[300px] overflow-y-auto p-2">
              {allComments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex justify-between bg-gray-900 rounded-lg p-2"
                >
                  <div className="flex space-x-3">
                    <Avatar>
                      <AvatarImage src={comment.user.profile_image} alt="profile_image"/>
                      <AvatarFallback>
                        {comment.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {comment.user.username}
                      </div>
                      <div className="text-sm text-gray-400">
                        {comment.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimeElapsed(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      comment.user.id !== user?.userid && "hidden"
                    }`}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <BsThreeDots />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete Comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommentsPage;
