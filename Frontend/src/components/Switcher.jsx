import { useState } from "react";
import { useTeams } from "../context/TeamsContext";
import Overlay from "./Overlay";
import { useEventListener } from "@liveblocks/react";

export default function Switcher({selectedIndex, setSelectedIndex}) {
    // Dropdown show
    const [show, setShow] = useState(false);

    // Fetch teams
    const {teams, setTeams} = useTeams();

    // Overlay
    const [overlay, setOverlay] = useState(false);
    

    return <div className="switcher" onClick={() => setShow(!show)}>
        <div className="box">
            <div className="option">
                {teams[selectedIndex]?.logo}
                {teams[selectedIndex]?.name}
            </div>
        </div>

        <div className={`dropdown ${show? "show" : ""}`}>
            <button className="option" onClick={()=>setOverlay("create team")}>Create New Team</button>
            {teams.map((item, i) => (
                <div className="option" onClick={()=>setSelectedIndex(i)}>
                    {item.logo}
                    {item.name}
                </div>
            ))}
        </div>

        {overlay && <Overlay info={overlay} onClose={()=>setOverlay(false)} setTeams={setTeams} />}
    </div>
}