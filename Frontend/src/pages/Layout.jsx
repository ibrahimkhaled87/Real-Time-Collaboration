import { SearchIcon, BookMarked, LayoutGrid, Star, UserIcon, SettingsIcon, Pyramid } from "lucide-react";
import { useEffect, useState } from "react";
import Switcher from "../components/Switcher";
import User from "../components/User";
import { useTeams } from "../context/TeamsContext";
import Boards from "./Boards";
import EmptyTeams from "./empty/EmptyTeams";
import { useSearchParams } from "react-router-dom";
import { RoomProvider } from "@liveblocks/react";
import Members from "./Members";
import useTokenDecode from "../hooks/useTokenDecode";
import Favorites from "./Favorites";
import Settings from "./Settings";
import Overlay from "../components/Overlay";
import Notifications from "../components/Notifications";

export default function Layout() {
    const payload = useTokenDecode();

    //Fetch teams
    const {teams} = useTeams();

    const [searchParams, setSearchParams] = useSearchParams();
    // Selected team
    const team = Number(searchParams.get("team") || 0);
    const [selectedIndex, setSelectedIndex] = useState(team);

    // Selected tab
    const tab = searchParams.get("tab") || "boards";
    const [selectedTab, setSelectedTab] = useState("boards");

    useEffect(() => { //index from params
        const index = teams.findIndex(item => item.id == team);
        setSelectedIndex(index >= 0 ? index : 0);
        if(["boards", "favorites", "members", "settings"].includes(tab))
            setSelectedTab(tab);
    }, [team, teams, tab]);

    useEffect(() => {
        if (!teams.length) return;

        setSearchParams({team: teams[selectedIndex]?.id, tab: selectedTab})
    }, [teams, selectedIndex, selectedTab])


    //Invitation
    const [overlay, setOverlay] = useState(false);


    return <div className="layout">
        <div className="left">
            <div className="logo">
                <BookMarked />
                <h1>Boards</h1>
            </div>
            <Switcher selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
            <ul className="tabs">
                <li className={selectedTab==="boards" && "selected"} onClick={()=>setSelectedTab("boards")}>
                    <LayoutGrid/> 
                    Team Boards
                </li>
                <li className={selectedTab==="favorites" && "selected"} onClick={()=>setSelectedTab("favorites")}>
                    <Star/> 
                    Favorites
                </li>
                <li className={selectedTab==="members" && "selected"} onClick={()=>setSelectedTab("members")}>
                    <UserIcon fill="black" /> 
                    Members
                </li>
                {teams?.find(el=>el.id===team)?.owner===payload?.username && 
                <li className={selectedTab==="settings" && "selected"} onClick={()=>setSelectedTab("settings")}>
                    <SettingsIcon/>
                    Settings
                </li>
                }
            </ul>
        </div>

        <div className="right">
            <div className="top-nav">
                <Switcher selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                <div className="search">
                    <SearchIcon className="searchIcon" />
                    <input type="search" placeholder="Search for boards"/>
                </div>
                <button onClick={()=>setOverlay(["invitation", team])}>+ Invite members</button>
                <Notifications />
                <User />
            </div>

            <div className="content">
                {!teams.length
                ? <EmptyTeams />

                : selectedTab==="boards"
                ? <RoomProvider id={`team:${teams[selectedIndex]?.id}`}>
                    <Boards team={teams[selectedIndex]?.id} />
                  </RoomProvider>
                
                : selectedTab==="members"
                ? <Members team={teams[selectedIndex]?.id} />
                
                : selectedTab==="favorites"
                ? <Favorites />

                : selectedTab==="settings"
                ? <Settings team={teams[selectedIndex]?.id} />

                : null
                }
            </div>
        </div>

        <Overlay info={overlay} onClose={()=>setOverlay(false)} />
    </div>
}