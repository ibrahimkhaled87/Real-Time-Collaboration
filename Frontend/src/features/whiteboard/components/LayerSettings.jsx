import { useBroadcastEvent } from "@liveblocks/react";
import { BringToFrontIcon, SendToBackIcon, Trash2 } from "lucide-react"
import api from "../../../utils/axios";
import { useHistory } from "../context/HistoryContext";

export default function LayerSettings({stickyArr, setStickyArr, selectedId}) {
    const broadcast = useBroadcastEvent();
    const {historyRef, undoRef} = useHistory();

    const handleClick = (color) => {
        if(!selectedId) return;
        const note = stickyArr.find(el => el.id===selectedId);
        const updatedNote = {
            ...note,
            color: color
        }
        setStickyArr(prev => prev.map(n => n.id===selectedId ? updatedNote : n));
        broadcast({
            type: "note-update",
            note: updatedNote
        })

        api.post("/teams/boards/29", {op:"note-update", note:updatedNote});
        historyRef.current.push({op:"note-update", before:note, after:updatedNote});
    }

    const handleBring = (position) => {
        if(!selectedId) return;
        const note = stickyArr.find(el => el.id===selectedId);
        const previousIndex = stickyArr.findIndex(el => el.id===selectedId);
        if(position==="front") {
            const updatedArr = [...stickyArr.filter(el=>el.id!==selectedId), note];
            setStickyArr(updatedArr);
            broadcast({
                type: "note-bring",
                position: "front",
                note: note
            })
            api.post("/teams/boards/29", {op:"note-bring", position:"front", note:note});
            historyRef.current.push({op:"note-bring", position:"front", previousIndex:previousIndex, note:note});
        }
        else if(position==="back") {
            const updatedArr = [note, ...stickyArr.filter(el=>el.id!==selectedId)];
            setStickyArr(updatedArr);
            broadcast({
                type: "note-bring",
                position: "back",
                note: note
            })
            api.post("/teams/boards/29", {op:"note-bring", position:"back", note:note});
            historyRef.current.push({op:"note-bring", position:"back", previousIndex:previousIndex, note:note});
        }
        else {
            const updatedArr = [...stickyArr.filter(el=>el.id!==selectedId)];
            setStickyArr(updatedArr);
            broadcast({
                type: "note-bring",
                position: "delete",
                note: note
            })
            api.post("/teams/boards/29", {op:"note-bring", position:"delete", note:note});
            historyRef.current.push({op:"note-bring", position:"delete", note:note});
        }
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
            <BringToFrontIcon className="icon" onClick={()=>handleBring("front")} />
            <SendToBackIcon className="icon" onClick={()=>handleBring("back")} />
        </div>
        <div className="delete">
            <Trash2 className="icon" onClick={()=>handleBring("delete")} />
        </div>
    </div>
}