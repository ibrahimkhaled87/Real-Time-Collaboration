import { useState } from "react";
import { useTeams } from "../context/TeamsContext";
import api from "../utils/axios";
import Overlay from "../components/Overlay";

export default function Settings({team}) {
    const {teams, setTeams} = useTeams();

    const [newName, setNewName] = useState("");
    const editTeam = async(e) => {
        e.preventDefault();
        await api.patch(`/teams/${team}`, {name: newName})
        setTeams(prev => prev.map(el => el.id!=team ? el : {...el, name: newName}));
        setNewName("");
    }

    const [overlay, setOverlay] = useState(false);

    return <div className="settings">
        <h2>Settings</h2>

        <div className="edit">
            <p>Edit team name</p>
            <form onSubmit={editTeam}>
                <input type="text" value={newName} placeholder={teams?.find(el=>el.id===team)?.name} onChange={(e)=>setNewName(e.target.value)}/>
                <button>Edit</button>
            </form>
        </div>
        <div className="delete">
            <p>Delete team</p>
            <button onClick={()=>setOverlay(["delete team", team])} >Delete Team</button>
        </div>

        {overlay && <Overlay info={overlay} onClose={()=>setOverlay(false)} setTeams={setTeams} />}
    </div>
}