import { useState } from "react"
import { useParams } from "react-router-dom";
import { RoomProvider, useUpdateMyPresence } from "@liveblocks/react";

import useTokenDecode from "../../hooks/useTokenDecode";
import Context from "./components/Context";
import Presence from "./components/Presence";
import Toolbar from "./components/Toolbar";
import ChatPanel from "./components/ChatPanel";
import Canvas from "./components/Canvas";
import { HistoryProvider } from "./context/HistoryContext";


export function Room() {
    const {boardId} = useParams();

    const [selectedTool, setSelectedTool] = useState("pen");
    const [position, setPosition] = useState({x:0, y:0})

    //Emit my presence
    const payload = useTokenDecode();
    const updateMyPresence = useUpdateMyPresence();

    const handleMouseMove = (e) => {
        setPosition({x: e.clientX, y: e.clientY});
        updateMyPresence({
            username: payload?.username,
            cursor: {
                x: e.clientX,
                y: e.clientY,
            },
        });
    };

    const handleMouseLeave = () => {
        updateMyPresence({ 
            username: payload?.username,
            cursor: null 
        });
    };


    return <div className="app" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <Context />
        <Presence />
        <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

        <ChatPanel />
        
        <Canvas selectedTool={selectedTool} position={position} boardId={boardId} />
    </div>
}

export default function Whiteboard() {
    const {boardId} = useParams();

    const payload = useTokenDecode();
    if(!payload) return;

    return (
        <RoomProvider id={`board:${boardId}`} initialPresence={{ 
            username: payload?.username,
            cursor: null 
        }}>
            <HistoryProvider>
                <Room />
            </HistoryProvider>
        </RoomProvider>
    );
}