import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { socket } from "@/Config/socketConfig";
const WINNING_COMBINATIONS = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
];
const GamePage = () => {
    const [grid, setGrid] = useState(Array(9).fill(null));
    const [prevTurn, setPrevTurn] = useState("team-2");
    const [currTurn, setCurrTurn] = useState("team-1");
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    // Check for winner
    const checkWinner = (currentGrid) => {
        for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (currentGrid[a] &&
                currentGrid[a] === currentGrid[b] &&
                currentGrid[a] === currentGrid[c]) {
                // Convert X/O to team
                return currentGrid[a] === "X" ? "team-1" : "team-2";
            }
        }
        return null;
    };
    // Check for draw
    const checkDraw = (currentGrid) => {
        return currentGrid.every(cell => cell !== null);
    };
    const handleBoxClick = (index) => {
        // Prevent click if game is over or box is already filled
        if (gameOver || grid[index] ||
            (currTurn === "team-1" && prevTurn !== "team-2") ||
            (currTurn === "team-2" && prevTurn !== "team-1"))
            return;
        const updatedGrid = [...grid];
        const mark = currTurn === "team-1" ? "X" : "O";
        updatedGrid[index] = mark;
        // Check for winner before updating state
        const potentialWinner = checkWinner(updatedGrid);
        if (potentialWinner) {
            setWinner(potentialWinner);
            setGameOver(true);
            socket.emit("game-over", { winner: potentialWinner });
        }
        else if (checkDraw(updatedGrid)) {
            setGameOver(true);
            socket.emit("game-over", { winner: null });
        }
        setGrid(updatedGrid);
        // Emit event for box click
        socket.emit("box-clicked", { boxIndex: index, team: currTurn });
        // Update turns
        setPrevTurn(currTurn);
        setCurrTurn(currTurn === "team-1" ? "team-2" : "team-1");
    };
    // Reset game
    const resetGame = () => {
        setGrid(Array(9).fill(null));
        setWinner(null);
        setGameOver(false);
        setCurrTurn("team-1");
        setPrevTurn("team-2");
    };
    useEffect(() => {
        // Listen for "box-clicked" events
        socket.on("box-clicked", (data) => {
            const updatedGrid = [...grid];
            updatedGrid[data.boxIndex] = data.team === "team-1" ? "X" : "O";
            const potentialWinner = checkWinner(updatedGrid);
            if (potentialWinner) {
                setWinner(potentialWinner);
                setGameOver(true);
            }
            else if (checkDraw(updatedGrid)) {
                setGameOver(true);
            }
            setPrevTurn(data.team);
            setCurrTurn(data.team === "team-1" ? "team-2" : "team-1");
            console.log(currTurn, prevTurn);
            setGrid(updatedGrid);
        });
        // Listen for game over event
        socket.on("game-over", (data) => {
            setWinner(data.winner);
            setGameOver(true);
        });
        return () => {
            socket.off("box-clicked");
            socket.off("game-over");
        };
    }, [grid]);
    // Render winner screen
    if (gameOver) {
        return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-8 rounded-xl text-center space-y-4", children: [_jsx("h2", { className: "text-3xl font-bold", children: winner ?
                            `Team ${winner === "team-1" ? "1" : "2"} Wins!`
                            : "It's a Draw!" }), _jsxs("div", { className: "flex justify-center items-center space-x-5", children: [_jsx("div", { className: "border rounded p-2 bg-white text-black", children: _jsxs("div", { className: "font-bold flex gap-x-2 items-center", children: [_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: "https://github.com/shadcn.png" }), _jsx(AvatarFallback, { className: "text-black", children: "1ST" })] }), " ", "Saurbh Kumar"] }) }), _jsx("div", { className: "text-5xl", children: " vs" }), _jsx("div", { className: "border rounded p-2 bg-white text-black", children: _jsxs("div", { className: "font-bold flex gap-x-2 items-center", children: [_jsxs(Avatar, { children: [_jsx(AvatarImage, { src: "https://github.com/shadcn.png" }), _jsx(AvatarFallback, { className: "text-black", children: "2ND" })] }), " ", "Harmeet Singh"] }) })] }), _jsx("button", { onClick: resetGame, className: "bg-blue-500 text-white p-2 rounded hover:bg-blue-600", children: "Play Again" })] }) }));
    }
    return (_jsx("div", { className: "game-section container mx-auto p-4", children: _jsxs("div", { className: "border rounded-xl p-3 flex flex-col justify-center items-center space-y-10 py-10", children: [_jsx("div", { className: "tic-tac-toe-grid grid grid-cols-3 gap-2 border p-4 rounded", children: grid.map((mark, index) => (_jsx("div", { className: `h-20 w-20 border flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-gray-100 
                ${mark === "X" ? "text-blue-500" : "text-red-500"}`, onClick: () => handleBoxClick(index), children: mark }, index))) }), _jsx("div", { children: _jsx("button", { className: `p-2 rounded ${currTurn === "team-1"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"}`, children: currTurn === "team-1" ? "Team 1's Turn" : "Team 2's Turn" }) }), _jsx("div", { className: "border py-5 px-2 rounded-full", children: _jsx("span", { className: "border p-3 rounded-full", children: "30" }) })] }) }));
};
export default GamePage;
