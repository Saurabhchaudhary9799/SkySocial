import { jsx as _jsx } from "react/jsx-runtime";
const CircleLoader = () => {
    return (_jsx("div", { className: "flex justify-center items-center h-full", children: _jsx("div", { className: "w-6 h-6 border-4 border-white border-t-4 border-t-blue-500 rounded-full animate-spin" }) }));
};
export default CircleLoader;
