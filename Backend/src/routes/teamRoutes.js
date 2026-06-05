import { Router } from "express";
import { deleteTeam, deleteTeamBoard, deleteTeamMembers, getTeamBoards, getTeamMembers, getTeamMessages, getTeams, getWhiteboard, patchTeam, postTeam, postTeamBoard, postTeamMessage, postWhiteboard } from "../controllers/teamController.js";

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

//Board content
router.get("/boards/:boardId", getWhiteboard);
router.post("/boards/:boardId", postWhiteboard);

//Messages
router.get("/:teamId/messages", getTeamMessages);
router.post("/:teamId/messages", postTeamMessage);

//Members
router.get("/:teamId/members", getTeamMembers);
router.delete("/:teamId/members", deleteTeamMembers);


export default router