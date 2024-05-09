import express from "express";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/StatsController.js";
import { adminOnly } from "../middlewares/auth.js";


const statsRoute  = express.Router();

statsRoute.get("/stats",adminOnly,getDashboardStats);
statsRoute.get("/pie",adminOnly,getPieCharts);
statsRoute.get("/bar",adminOnly,getBarCharts);
statsRoute.get("/line",adminOnly,getLineCharts);

export default statsRoute;