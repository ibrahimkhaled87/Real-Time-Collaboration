import { Pen, Eraser, StickyNote, TextCursorIcon, MousePointer } from "lucide-react"

export default function Toolbar({selectedTool, setSelectedTool}) {
    return <>
        <div className="flowing toolset">
            <Pen className={`tool ${selectedTool==="pen" && "selected"}`} onClick={()=>setSelectedTool("pen")}/>
            <Eraser className={`tool ${selectedTool==="eraser" && "selected"}`} onClick={()=>setSelectedTool("eraser")}/>
            <StickyNote className={`tool ${selectedTool==="sticky" && "selected"}`} onClick={()=>setSelectedTool("sticky")}/>
            <TextCursorIcon className={`tool ${selectedTool==="text" && "selected"}`} onClick={()=>setSelectedTool("text")}/>
            <MousePointer className={`tool ${selectedTool==="cursor" && "selected"}`} onClick={()=>setSelectedTool("cursor")}/>
        </div>
    </>
}