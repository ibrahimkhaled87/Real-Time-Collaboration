import { useEffect, useState } from "react"
import api from "../utils/axios";
import { useFetchTeamMembers } from "../hooks/useFetch";
import { User2Icon } from "lucide-react";
import useTokenDecode from "../hooks/useTokenDecode";
import { useOthers } from "@liveblocks/react";
import { Dot } from "lucide-react";

export default function Members({team}) {
    const payload = useTokenDecode();

    //Fetch Members
    const {members, setMembers} = useFetchTeamMembers(team);

    //Selected tab
    const [selectedTab, setSelectedTab] = useState("members");

    //Manage members
    const owner = members?.find(el=>el.username===payload.username) ? false : true;
    const [removals, setRemovals] = useState([]);
    const confirmRemoval = async() => {
        await api.delete(`/teams/${team}/members`, {data: {removals}});
        setMembers(prev => prev.filter(member => !removals.includes(member.username)));
        setRemovals([]);
    }

    //Online users
    const others = useOthers();
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(()=>{
        console.log(others);
        const arr = others.map(({presence}) => presence.online);
        setOnlineUsers(arr);
    }, [others])

    return <div className="members">
        <h2>Members</h2>
        <p>View and manage organization members</p>
        <ul className="tabs">
            <li className={selectedTab==="members" && "selected"} onClick={()=>setSelectedTab("members")}>Members</li>
            <li className={selectedTab==="invitations" && "selected"} onClick={()=>setSelectedTab("invitations")}>Invitations</li>
        </ul>

        {selectedTab==="members" && 
        <div className="list">
            <h4>Team Members ({members?.length})</h4>
            {members?.map(member => (
                <div className="member">
                    <User2Icon />
                    <p>
                        {member.full_name}
                        <span>{member.username===payload.username && "(You)"}</span> 
                    </p>
                    <p>{onlineUsers.includes(member.username) ? "online" : "offline"}</p>
                    {!owner? null : !removals.includes(member.username)
                    ? <button onClick={()=>setRemovals(prev=>[...prev, member.username])}>Remove</button>
                    : <div className="area">
                        <span>Removal pending</span>
                        <button onClick={()=>setRemovals(prev=> (prev.filter(el=>el!==member.username)) )} >Undo</button>
                      </div>
                    }
                </div>
            ))}
            {!removals.length? null : <div className="buttons">
                <button className="cancel" onClick={()=>setRemovals([])}>Cancel</button>
                <button className="confirm" onClick={confirmRemoval}>Confirm Changes</button>
            </div>}
        </div>
        }
    </div>

}