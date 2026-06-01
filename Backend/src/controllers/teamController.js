import db from "../config/db.js";
import { liveblocks } from "../config/liveblocks.js";

// Teams
export const getTeams = async(req, res) => {
    console.log("GET teams called");
    console.log(req.query);
    const {current} = req.query;

    const data = await db.query(`SELECT DISTINCT w.* 
        FROM workspaces w 
        LEFT JOIN workspace_members wm
        ON w.id=wm.workspace_id
        WHERE w.owner = $1
        OR wm.username = $1
        `, [current]);
    res.json(data.rows);
} 

export const postTeam = async(req, res) => {
    console.log("POST team called");
    console.log(req.body);
    const {name, owner} = req.body;

    const data = await db.query("INSERT INTO workspaces(name, owner) VALUES($1, $2) RETURNING *", [name, owner]);
    res.json(data.rows);
}

export const deleteTeam = async(req, res) => {
    console.log("DELETE team called");
    console.log(req.params);
    const {teamId} = req.params;

    await db.query("DELETE FROM workspaces WHERE id=$1", [teamId]);
    res.json("Deleted team");
}

export const patchTeam = async(req, res) => {
    console.log("PATCH team called");
    console.log(req.params);
    const {teamId} = req.params;
    console.log(req.body);
    const {name} = req.body;

    await db.query("UPDATE workspaces SET name=$1 WHERE id=$2", [name, teamId]);
    res.json("Updated team");
}


// Boards
export const getTeamBoards = async(req, res) => {
    console.log("GET team boards called");
    console.log(req.params);
    const {teamId} = req.params;

    const data = await db.query(`SELECT * FROM workspace_boards WHERE workspace_id=$1`, [teamId]);
    res.json(data.rows);
}

export const postTeamBoard = async(req, res) => {
    console.log("POST team board called");
    console.log(req.params);
    const {teamId} = req.params;
    console.log(req.body);
    const {name, type} = req.body;

    const data = await db.query(`INSERT INTO workspace_boards(workspace_id, name, type) VALUES($1, $2, $3) RETURNING *`, [teamId, name, type]);
    res.json("Created board");

    await liveblocks.broadcastEvent(`team:${teamId}`, {
        type: "new-board",
        board: data.rows[0]
    });
}

export const deleteTeamBoard = async(req, res) => {
    console.log("GET team boards called");
    console.log(req.params);
    const {teamId, boardId} = req.params;

    await db.query(`DELETE FROM workspace_boards WHERE id=$1`, [boardId]);
    res.json("Deleted board");

    await liveblocks.broadcastEvent(`team:${teamId}`, {
        type: "delete-board",
        boardId: boardId
    });
}


// Messages
export const getTeamMessages = async(req, res) => {
    console.log("GET team messages called");
    console.log(req.params);
    const {teamId} = req.params;

    const data = await db.query("SELECT * FROM workspace_messages WHERE workspace_id = $1 ORDER BY id DESC", [teamId]);
    res.json(data.rows);
}

export const postTeamMessage = async(req, res) => {
    console.log("POST team message called");
    console.log(req.params);
    const {teamId} = req.params;
    console.log(req.body);
    const {message, sender} = req.body;

    const data = await db.query("INSERT INTO workspace_messages(workspace_id, message, sender) VALUES($1, $2, $3) RETURNING *", [teamId, message, sender]);
    res.json("Inserted message");

    await liveblocks.broadcastEvent("board:29", {
        type: "new-message",
        message: data.rows[0]
    });
}


// Members
export const getTeamMembers = async(req, res) => {
    console.log("GET team members called");
    console.log(req.params);
    const {teamId} = req.params;

    const data = await db.query(`SELECT * 
        FROM workspace_members wm  
        JOIN users u
        ON wm.username = u.username
        WHERE workspace_id=$1`, [teamId]);
    res.json(data.rows);
}

export const deleteTeamMembers = async(req, res) => {
    console.log("DELETE team members called");
    console.log(req.params);
    const {teamId} = req.params;
    console.log(req.body);
    const {removals} = req.body;

    const data = await db.query("DELETE FROM workspace_members WHERE workspace_id=$1 AND username=ANY($2)", [teamId, removals]);
    res.json("Deleted members");
}