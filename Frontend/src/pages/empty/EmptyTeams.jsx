import { useState } from "react"
import Overlay from "../../components/Overlay"
import { useTeams } from "../../context/TeamsContext";

export default function EmptyTeams() {
    const {setTeams} = useTeams();
    const [overlay, setOverlay] = useState(false);

    return <div className="empty empty-teams">
        <img src="/images/empty-teams.svg" alt="" />         
        <h3>Welcome to Boards</h3>
        <p>Create an organization to get started.</p>
        <button onClick={()=>setOverlay("create team")}>Create Organization</button>       

        {overlay && <Overlay info={overlay} onClose={()=>setOverlay(false)} setTeams={setTeams} />} 
    </div>
}