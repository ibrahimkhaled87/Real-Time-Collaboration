import db from "../config/db.js";
import { liveblocks } from "../config/liveblocks.js";

const isTeamMember = async(username, team) => {
    const data = await db.query(`SELECT DISTINCT w.id 
        FROM workspaces w 
        LEFT JOIN workspace_members wm
        ON w.id=wm.workspace_id
        WHERE (w.owner = $1 OR wm.username = $1)
        AND w.id = $2
        `, [username, team]);

    return data.rows.length===1;
}

const isBoardMember = async(username, board) => {
    const data = await db.query(`SELECT DISTINCT wb.id 
        FROM workspaces w 
        LEFT JOIN workspace_members wm
        ON w.id=wm.workspace_id
        JOIN workspace_boards wb
        ON w.id = wb.workspace_id
        WHERE (w.owner = $1 OR wm.username = $1)
        AND wb.id = $2
        `, [username, board]);

    return data.rows.length===1;
}

export const liveblocksAuth = async(req, res) => {
    const username = req.user.username; //From previous token middleware
    const room = req.body.room;
    const session = liveblocks.prepareSession(username);

    if(room==="app-room") {
        session.allow(room, session.FULL_ACCESS);
    }

    else if(room.startsWith("user:")) {
        const roomUser = room.split(":")[1];
        if(username!==roomUser)
            return res.status(403).end();

        session.allow(room, session.FULL_ACCESS);
    }

    else if(room.startsWith("team:")) {
        const roomTeam = room.split(":")[1];
        const isMember = await isTeamMember(username, roomTeam);
        if(!isMember)
            return res.status(403).end();

        session.allow(room, session.FULL_ACCESS);
    }

    else if(room.startsWith("board:")) {
        const roomBoard = room.split(":")[1];
        const isMember = await isBoardMember(username, roomBoard);
        if(!isMember)
            return res.status(403).end();

        session.allow(room, session.FULL_ACCESS);
    }

    //return room connection session to frontend
    const {status, body} = await session.authorize();
    res.status(status).end(body);
}