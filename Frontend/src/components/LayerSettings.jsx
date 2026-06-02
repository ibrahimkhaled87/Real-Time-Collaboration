import { BringToFrontIcon, SendToBackIcon, Trash2 } from "lucide-react"

export default function LayerSettings({stickyArr, setStickyArr, selectedId}) {
    const handleClick = (color) => {
        if(!selectedId) return;
        const note = stickyArr.find(el => el.id===selectedId);
        const updatedNote = {
            ...note,
            color: color
        }
        setStickyArr(prev => prev.map(n => n.id===selectedId ? updatedNote : n));
    }

    return <div className="layerSettings" contentEditable={false}>
        <div className="colors">
            <div className="red" style={{backgroundColor: "red"}} onClick={()=>handleClick("red")}></div>
            <div className="blue" style={{backgroundColor: "blue"}} onClick={()=>handleClick("blue")}></div>
            <div className="yellow" style={{backgroundColor: "yellow"}} onClick={()=>handleClick("yellow")}></div>
            <div className="green" style={{backgroundColor: "green"}} onClick={()=>handleClick("green")}></div>
            <div className="violet" style={{backgroundColor: "violet"}} onClick={()=>handleClick("violet")}></div>
            <div className="beige" style={{backgroundColor: "beige"}} onClick={()=>handleClick("beige")}></div>
            <div className="white" style={{backgroundColor: "white"}} onClick={()=>handleClick("white")}></div>
            <div className="black" style={{backgroundColor: "black"}} onClick={()=>handleClick("black")}></div>
        </div>
        <div className="position">
            <BringToFrontIcon className="icon" />
            <SendToBackIcon className="icon" />
        </div>
        <div className="delete">
            <Trash2 className="icon" />
        </div>
    </div>
}