import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrder, newOrder, processOrder  } from "../controllers/OrderController.js";
const orderRoute = express.Router()

orderRoute.post("/new",newOrder)

orderRoute.get("/my",myOrder)
orderRoute.get("/all",adminOnly,allOrders)
orderRoute.route("/:id").get(getSingleOrder).put(adminOnly,processOrder).delete(adminOnly,deleteOrder)

export default orderRoute;