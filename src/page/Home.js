import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import CreatePost from '@/components/CreatePost';
import Posts from '@/components/Posts';
import ProfileBox from '@/components/ProfileBox';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostProvider } from '@/context/PostContext';
import SuggestedPeople from '@/components/SuggestedPeople';
import CustomChallenge from '@/components/CustomChallenge';
// interface User {
//   authtoken: string;
//   userid: string;
//   username: string;
//   useremail: string;
// }
const Home = () => {
    // const [user, setUser] = useState<User | null>(null); 
    const navigate = useNavigate();
    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
            navigate("/register");
        }
    }, [navigate]);
    // useEffect(() => {
    //   const storedData = localStorage.getItem('userData');
    //   // console.log(storedData);
    //   if (!storedData) {
    //     navigate("/register");
    //   } else {
    //     const { authToken, result } = JSON.parse(storedData);
    //     const userDetails: User = {
    //       authtoken: authToken,
    //       userid: result.user.id,
    //       username: result.user.username,
    //       useremail: result.user.email,
    //     };
    //     setUser(userDetails);
    //   }
    // }, [navigate]);
    return (_jsx(_Fragment, { children: _jsx(PostProvider, { children: _jsx("div", { className: "home-section container mx-auto p-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-x-4", children: [_jsxs("div", { className: "hidden md:block md:col-span-3 lg:col-span-3  space-y-5", children: [_jsx(ProfileBox, {}), _jsx(CustomChallenge, {})] }), _jsxs("div", { className: "col-span-1 md:col-span-6 lg:col-span-6 rounded-xl space-y-5 ", children: [_jsx(CreatePost, {}), _jsx(Posts, {})] }), _jsx("div", { className: "hidden md:block md:col-span-3 lg:col-span-3 bg-gray-800 p-4 rounded-xl space-y-6 h-[330px]   overflow-y-auto", children: _jsx(SuggestedPeople, {}) })] }) }) }) }));
};
export default Home;
