import api from "../utils/axios";
import { useFetchTeamBoards } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import EmptyBoards from "./empty/EmptyBoards";
import { toast, Toaster } from "react-hot-toast";
import { useState } from "react";
import Overlay from "../components/Overlay";
import { useEventListener } from "@liveblocks/react";

export default function Boards({team}) {
    //Fetch team boards
    const {boards, setBoards} = useFetchTeamBoards(team);

    //Navigate
    const navigate = useNavigate();

    //Delete board
    const deleteBoard = async(e, boardId) => {
        e.stopPropagation();
        try {
            await api.delete(`/teams/${team}/boards/${boardId}`);
            toast.success("Deleted board")
        } catch (error) {
            toast.error("Couldn't delete board");
        }
    }

    //Overlay
    const [overlay, setOverlay] = useState(false);

    //Listen backend
    useEventListener(({ event }) => {
    switch (event.type) {
        case "new-board":
            setBoards(prev => [...prev, event.board]);
            break;
        case "delete-board":
            setBoards(prev => (prev.filter(el => el.id != event.boardId)));
            break;
    }
    });
    

    if(!boards) return <EmptyBoards />

    return <div className="boards">
        <Toaster position="top-center" duration="2000" />

        <div className="card add" onClick={()=>setOverlay(["create board", team])}>
            <p>+</p>
            <span>New board</span>
        </div>
        {boards?.map(board => (
            <div className="card board" onClick={()=>navigate(`/board/${board.id}`)}>
                <p className="delete" onClick={(e)=>deleteBoard(e, board.id)} >&times;</p>
                <div className="image"></div>
                <div className="info">
                    <p className="name">{board.name}</p>
                    <span>You, 1 hour ago</span>
                </div>
            </div>
        ))}

        { overlay && <Overlay info={overlay} onClose={()=>setOverlay(false)} setBoards={setBoards} /> }
    </div>
}