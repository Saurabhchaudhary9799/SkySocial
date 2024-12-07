import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
// Create the UserContext
const UserContext = createContext(undefined);
// Custom hook to use UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
// UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Fetch user data from the API
    useEffect(() => {
        const fetchUserData = async () => {
            // console.log('hello')
            const storedData = localStorage.getItem('userData');
            if (storedData) {
                const { authToken, result } = JSON.parse(storedData);
                try {
                    const response = await axios.get(`${BASE_URL}/api/v1/users`, {
                        headers: { Authorization: `Bearer ${authToken}` },
                    });
                    const { user: fetchedUser } = response.data.result;
                    // const fetchedUser = result.user;
                    // console.log(fetchedUser)
                    const userDetails = {
                        authToken: authToken,
                        userid: fetchedUser._id,
                        name: fetchedUser.name,
                        username: fetchedUser.username,
                        useremail: fetchedUser.email,
                        bio: fetchedUser.bio,
                        profile_image: fetchedUser.profile_image,
                        cover_image: fetchedUser.cover_image,
                        posts: fetchedUser.posts,
                        savedPosts: fetchedUser.savedPosts, // Set user's posts
                        followers: fetchedUser.followers,
                        followings: fetchedUser.followings
                    };
                    setUser(userDetails);
                }
                catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);
    // Sync user data with localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('userData', JSON.stringify({
                authToken: user.authToken,
                result: {
                    user: {
                        _id: user.userid,
                        name: user.name,
                        username: user.username,
                        email: user.useremail,
                        bio: user.bio,
                        profile_image: user.profile_image,
                        cover_image: user.cover_image,
                        posts: user.posts,
                        savedPost: user.savedPosts, // Store user's posts
                    },
                },
            }));
        }
    }, [user]);
    // Function to update user data
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };
    return (_jsx(UserContext.Provider, { value: { user, setUser, updateUser }, children: children }));
};
