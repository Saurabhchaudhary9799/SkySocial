import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

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

export interface Post {
  _id: string;
  bio: string;
  image: string;
  user: {
    _id: string;
    username: string;
    email: string;
    profile_image:string;
    createdAt: string;
    __v: number;
    id: string;
  };
  tags:[string];
  comments: Comment[];
  likes: {
    _id: string;
    user: string;
    post: string;
  }[];
  createdAt: string;
  __v: number;
}

interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (bio: string,tags:string, image: File) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  createComment: (message: string, postId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  handleLikes: (postId: string) => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = localStorage.getItem("userData");
      const authToken = userData ? JSON.parse(userData).authToken : "";

      if (!authToken) {
        throw new Error("No auth token found");
      }

      const response = await axios.get<{
        status: string;
        total: number;
        result: { posts: Post[] };
      }>(`${import.meta.env.VITE_BASEURL}/api/v1/posts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const postsWithDefaults = response.data.result.posts.map((post) => ({
        ...post,
        comments: post.comments ?? [],
        likes: post.likes ?? [], // Ensure likes array is initialized
      }));

      setPosts(postsWithDefaults);
    } catch (error) {
      setError("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (bio: string,tags:string, image: File) => {
    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("tags", tags);
      formData.append("image", image);

      const authToken = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).authToken;
// console.log(formData)
      const response = await axios.post<{ status: string; post: Post }>(
        `${import.meta.env.VITE_BASEURL}/api/v1/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
console.log(response.data)
      const newPost = {
        ...response.data.post,
        comments: response.data.post.comments ?? [],
        likes: response.data.post.likes ?? [], // Ensure likes array is initialized
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const authToken = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).authToken;

      await axios.delete(`${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const createComment = async (message: string, postId: string) => {
    try {
      const authToken = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).authToken;

      const response = await axios.post<{ comment: Comment }>(
        `${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}/comments`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const newComment = response.data.comment;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, newComment],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  };

  // const deleteComment = async (postId: string, commentId: string) => {
  //   try {
  //     const authToken = JSON.parse(
  //       localStorage.getItem("userData") || "{}"
  //     ).authToken;
  
  //     // Send DELETE request to delete the comment
  //     await axios.delete(
  //       `http://localhost:8000/api/v1/posts/${postId}/comments/${commentId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`,
  //         },
  //       }
  //     );
  
  //     // Update the state by removing the comment from the post
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post._id === postId
  //           ? {
  //               ...post,
  //               comments: post.comments.filter(
  //                 (comment) => comment._id !== commentId
  //               ),
  //             }
  //           : post
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error deleting comment:", error);
  //     throw error;
  //   }
  // };
  
  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const authToken = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).authToken;
  
      // Send DELETE request to delete the comment
      await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      // Update the state by removing the comment from the post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments
                  ?.filter((comment) => comment && comment._id !== commentId) // Ensure comment exists and has _id
                  ?? [], // Add a fallback to prevent undefined
              }
            : post
        )
      );
      
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };
  

  const handleLikes = async (postId: string) => {
    try {
      const authToken = JSON.parse(
        localStorage.getItem("userData") || "{}"
      ).authToken;

      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/v1/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const message = response.data.message;
      // console.log(message)
      const newLike = response.data.like;
      // console.log(newLike);

      if (!newLike || !newLike.user) {
        console.error("Invalid like data:", newLike);
        return;

      }
//  console.log(newLike.user)
 
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes:
                  message === "Post liked"
                    ? [...post.likes, newLike] // Add new like
                    : post.likes.filter((like) => like.user !== newLike.user), // Remove like
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling like:", error);
      throw error;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        createPost,
        deletePost,
        createComment,
        deleteComment,
        handleLikes,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
