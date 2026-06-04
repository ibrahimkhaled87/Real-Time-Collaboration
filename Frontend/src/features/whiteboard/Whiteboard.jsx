import { useState } from "react";
import { RoomProvider, useBroadcastEvent } from "@liveblocks/react";
import { useParams } from "react-router-dom";
// hooks + components
import useTokenDecode from "../../hooks/useTokenDecode";
import useCanvas from "./hooks/useCanvas";
import useSticky from "./hooks/useSticky";
import useSelectionNet from "./hooks/useSelectionNet";
import Chat from "./components/Chat";
import Toolbar from "./components/Toolbar";
import usePresence from "./hooks/usePresence";
import Presence from "./components/Presence";
import Sticky from "./components/Sticky";

function Room() {
    const [position, setPosition] = useState({x:0, y:0}); //For flowing tool
    const [selectedTool, setSelectedTool] = useState("pen");
    const broadcast = useBroadcastEvent();
    const onMouseDown = (e) => {
        if(selectedTool==="pen" || selectedTool==="eraser")
            draw(e);
        else if(selectedTool==="cursor")
            putSelectionNet(e);
    }


    const {others, handleMouseMove, handleMouseLeave} = usePresence({setPosition});

    const {canvasRef, width, draw} = useCanvas({broadcast, selectedTool});    

    const sticky = useSticky({broadcast, selectedTool});

    const {selectionNet, putSelectionNet} = useSelectionNet(sticky.setSelctedId);


    return (
        <div className="app" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            {/* Flowing selection net */}
            <div 
                className="selectionNet"
                style={{
                    position: "absolute",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid blue",
                    left: selectionNet.x,
                    top: selectionNet.y,
                    width: selectionNet.width,
                    height: selectionNet.height,
                    visibility: selectionNet.visible? "visible" : "hidden",
                    pointerEvents: "none"
                }}
            />

            {/* Flowing sticky */}
            <Sticky broadcast={broadcast} selectedTool={selectedTool} {...sticky} />

            {/* Presence */}
            <Presence others={others} />


            {/* Toolbar */}
            <Toolbar width={width} position={position} selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

            {/* Chat panel */}
            <Chat />

            {/* Canvas */}
            <canvas 
                ref={canvasRef} 
                onMouseDown={onMouseDown} 
                onClick={sticky.addNote}
            />

        </div>
    );
}

export default function Whiteboard() {
    // Get board id
    const {boardId} = useParams();

    const payload = useTokenDecode();
    if(!payload) return;

    return (
        <RoomProvider id={`board:${boardId}`} initialPresence={{ 
            username: payload?.username,
            cursor: null 
        }}>
            <Room />
        </RoomProvider>
    );
}