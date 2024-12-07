import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
const StartGamePage = () => {
    return (_jsxs("div", { className: 'start-game px-4 py-2', children: [_jsxs("div", { className: 'flex justify-between items-center mb-10', children: [_jsx("h1", { className: 'text-3xl font-bold', children: "Tic Tac Toe" }), _jsx(Button, { children: "Leaderbord" })] }), _jsxs("div", { className: 'flex flex-col justify-center items-center gap-y-20', children: [_jsx("p", { className: 'text-2xl', children: "Start Manually or Invite your friend" }), _jsx("button", { className: 'bg-white/30 backdrop-blur-md k w-24 h-24 rounded-full text-2xl font-bold ', children: "Start" })] })] }));
};
export default StartGamePage;
