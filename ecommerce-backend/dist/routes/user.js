import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/UserController.js";
import { adminOnly } from "../middlewares/auth.js";
const userRoute = express.Router();
userRoute.post("/new", newUser);
userRoute.get("/all", adminOnly, getAllUsers);
userRoute.route("/:id").get(getUser).delete(adminOnly, deleteUser);
export default userRoute;
