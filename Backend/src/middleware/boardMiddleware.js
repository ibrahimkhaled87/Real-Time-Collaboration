import db from "../config/db.js";

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

export const requireBoardMember = async(req, res, next) => {
    const boardId = req.params.boardId;
    const username = req.user.username; //decodedd from protect

    const isAllowed = await isBoardMember(username, boardId);
    if(!isAllowed)
        return res.status(403).json({message: "Unauthorized board"});

    next();
}