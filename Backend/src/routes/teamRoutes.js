import { Router } from "express";
import { deleteTeam, deleteTeamBoard, deleteTeamMembers, getTeamBoards, getTeamMembers, getTeamMessages, getTeams, patchTeam, postTeam, postTeamBoard, postTeamMessage } from "../controllers/teamController.js";

const router = Router();

//Team
router.get("/", getTeams);
router.post("/", postTeam);
router.delete("/:teamId", deleteTeam);
router.patch("/:teamId", patchTeam);

//Boards
router.get("/:teamId/boards", getTeamBoards);
router.delete("/:teamId/boards/:boardId", deleteTeamBoard);
router.post("/:teamId/boards", postTeamBoard);

//Messages
router.get("/:teamId/messages", getTeamMessages);
router.post("/:teamId/messages", postTeamMessage);

//Members
router.get("/:teamId/members", getTeamMembers);
router.delete("/:teamId/members", deleteTeamMembers);


export default router