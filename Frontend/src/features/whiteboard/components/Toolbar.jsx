import { Eraser, Pen, StickyNote, TextCursorIcon, MousePointer, Undo, Redo } from "lucide-react";

export default function Toolbar({width, position, selectedTool, setSelectedTool}) {
    return <>
        <div className="flowing context">
            <p>Team 1</p>
        </div>
        <div className="flowing toolset">
            <Pen className={`tool ${selectedTool==="pen" && "selected"}`} onClick={()=>setSelectedTool("pen")}/>
            <Eraser className={`tool ${selectedTool==="eraser" && "selected"}`} onClick={()=>setSelectedTool("eraser")}/>
            <StickyNote className={`tool ${selectedTool==="sticky" && "selected"}`} onClick={()=>setSelectedTool("sticky")}/>
            <TextCursorIcon className={`tool ${selectedTool==="text" && "selected"}`} onClick={()=>setSelectedTool("text")}/>
            <MousePointer className={`tool ${selectedTool==="cursor" && "selected"}`} onClick={()=>setSelectedTool("cursor")}/>
        </div>
        <div className="flowing undo-redo">
            <Undo className="tool" />
            <Redo className="tool" />
        </div>
        <div 
            className="flowing tool"
            style={{
                width: width,
                height: width,
                borderRadius: "50%",
                backgroundColor: "transparent",
                border: "1px solid gray",
                position: "absolute",
                left: position.x,
                top: position.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none"
            }}
        />
    </>
}