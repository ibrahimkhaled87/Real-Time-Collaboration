import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import liveblocksRoutes from "./routes/liveblocksRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/api", liveblocksRoutes);


export default app;