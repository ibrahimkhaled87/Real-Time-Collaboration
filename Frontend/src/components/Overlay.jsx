import api from "../utils/axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import useTokenDecode from "../hooks/useTokenDecode";
import { useNavigate } from "react-router-dom";

export default function Overlay({info, onClose, setTeams}) {
  const payload = useTokenDecode();

  // New Team
  const [newTeam, setNewTeam] = useState("");
  const createTeam = async(e) => {
    e.preventDefault();
    try {
      const response = await api.post("/teams", {name:newTeam, owner:payload.username})
      console.log(response.data);
      setTeams(prev => [...prev, response.data[0]]);
      setNewTeam("");
      onClose();
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  }

  // Request Team Join
  const [requested, setRequested] = useState();
  const requestTeam = (e) => {
      e.preventDefault();
      onClose();
  }

  // New Board for team
  const [newBoard, setNewBoard] = useState({name:"", type:"kanban"});
  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewBoard(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const createBoard = async(e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/teams/${info[1]}/boards`, newBoard)
      setNewBoard("");
      onClose();
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  }
  
  // Delete team
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState("");
  const handleDelete = async(e, team) => {
    await api.delete(`/teams/${team}`);
    alert("deleted team");
    setTeams(prev => prev.filter(el=> el.id!=team));
    onClose();
  }

  // Invitation
  const [invited, setInvited] = useState("");
  const sendInvitation = async(e, team) => {
    // to backend notification
    await api.post(`/users/${invited}/notifications`, {notification: `You've been invited to join team ${team}`, type: "invitation"});
  }


  if(info==="create team")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Create New Team</h3>
          <form onSubmit={createTeam}>
            <input type="text" name="name" value={newTeam} placeholder="Team name" onChange={(e)=>setNewTeam(e.target.value)} />
            <button>Create</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info==="join team")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Request Team Join</h3>
          <form onSubmit={requestTeam}>
            <input type="text" name="id" value={requested} placeholder="Team id" onChange={(e)=>setRequested(e.target.value)} />
            <button>Request Team</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info[0]==="create board")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Create Board</h3>
          <p>Team {info[1]}</p>
          <form onSubmit={createBoard}>
            <input type="text" name="name" value={newBoard.name} placeholder="Board name" onChange={handleChange} />
            <select name="type" onChange={handleChange}>
              <option value="kanban">Kanban</option>
              <option value="whiteboard">Whiteboard</option>
            </select>
            <button>Create Board</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info[0]==="delete team")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Delete Team</h3>
          <p>Team {info[1]}</p>
          <form onSubmit={(e)=>handleDelete(e, info[1])}>
            <p>To confirm, type <span style={{fontWeight:"600"}}>"delete team"</span> below</p>
            <input type="text" onChange={(e)=>setConfirmDelete(e.target.value)} />
            <button disabled={confirmDelete!=="delete team"} style={{backgroundColor: confirmDelete!=="delete team" ? "gray" : "orange"}} >Delete Team</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info[0]==="invitation")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Invitation</h3>
          <p>Team {info[1]}</p>
          <form onSubmit={(e)=>sendInvitation(e, info[1])}>
            <p>Username</p>
            <input type="text" onChange={(e)=>setInvited(e.target.value)} />
            <button>Invite</button>
          </form>
        </div>
      </div>,
      document.body
    );
}