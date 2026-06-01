import db from "../config/db.js";
import { liveblocks } from "../config/liveblocks.js";

export const getUserNotifications = async(req, res) => {
    console.log("GET user notifications called");
    console.log(req.params);
    const {user} = req.params;

    const data = await db.query("SELECT * FROM user_notifications WHERE username=$1", [user]);
    res.json(data.rows);
}

export const postUserNotification = async(req, res) => {
    console.log("POST user notifications called");
    console.log(req.params);
    const {user} = req.params;
    console.log(req.body);
    const {notification, type} = req.body;

    const data = await db.query("INSERT INTO user_notifications(username, notification, type) VALUES($1, $2, $3) RETURNING *", [user, notification, type]);
    res.json("Inserted notification");

    await liveblocks.broadcastEvent(`user:${user}`, {
        type: "notification",
        notification: data.rows[0]
    });
}

export const patchUserNotification = async(req, res) => {
    console.log("PATCH user notifications called");
    console.log(req.params);
    const {user} = req.params;
    console.log(req.body);
    const {notification, action} = req.body;

    let data = await db.query("UPDATE user_notifications SET action=$1 WHERE id=$2 RETURNING *", [action, notification]);
    res.json("Updated notification");

    if(action==="accept") {
        const teamId = data.rows[0].notification.split("join team ")[1];
        await db.query("INSERT INTO workspace_members(workspace_id, username) VALUES($1, $2)", [teamId, user]);
        data = await db.query("SELECT * FROM workspaces WHERE id=$1", [teamId]);
        await liveblocks.broadcastEvent(`user:${user}`, {
            type: "new-team",
            team: data.rows[0]
        });
    }
}