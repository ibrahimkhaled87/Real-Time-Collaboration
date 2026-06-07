import { useState } from "react"
import Overlay from "../../components/Overlay"
import { useSearchParams } from "react-router-dom";

export default function EmptyBoards() {
    const [searchParams] = useSearchParams();
    const team = searchParams.get("team");

    const [overlay, setOverlay] = useState(false);

    return <div className="empty empty-teams">
        <img src="/images/empty-boards.svg" alt="" />         
        <h3>Create your first board!</h3>
        <p>Start by creating a board for your organization</p>
        <button onClick={()=>setOverlay(["create board", team])}>Create Board</button>      

        {overlay && <Overlay info={overlay} onClose={()=>setOverlay(false)} />}  
    </div>
}