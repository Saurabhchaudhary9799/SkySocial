import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Post from "./Post";
import { usePostContext } from "@/context/PostContext";
import { Skeleton } from "@/components/ui/skeleton";
const Posts = () => {
    const { posts, loading, error } = usePostContext();
    console.log(posts);
    if (loading)
        return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-x-2", children: [_jsx(Skeleton, { className: "h-16 w-16 rounded-full bg-gray-200" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" })] })] }), _jsx("div", { children: _jsx(Skeleton, { className: "w-full h-64 md:h-96 bg-gray-200" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-32  bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-16 bg-gray-200" }), _jsx(Skeleton, { className: "h-4  w-full bg-gray-200" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-x-2", children: [_jsx(Skeleton, { className: "h-16 w-16 rounded-full bg-gray-200" }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" })] })] }), _jsx("div", { children: _jsx(Skeleton, { className: "w-full h-64 md:h-96 bg-gray-200" }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-4 w-48 bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-32  bg-gray-200" }), _jsx(Skeleton, { className: "h-4 w-16 bg-gray-200" }), _jsx(Skeleton, { className: "h-4  w-full bg-gray-200" })] })] })] }));
    if (error)
        return _jsxs("div", { children: ["Error: ", error] });
    return (_jsx("div", { children: _jsx("ul", { className: "space-y-5", children: posts?.length > 0 ?
                posts.map((post) => (_jsx("div", { className: "bg-gray-800 rounded-xl p-4", children: _jsx(Post, { post: post }) }, post._id))) : _jsx("div", { className: "bg-gray-800 rounded-xl py-4 px-8 sm:px-16 text-center", children: _jsx("p", { children: "\"You're not following anyone yet. Explore users and start following them to see posts in your feed!\"" }) }) }) }));
};
export default Posts;
