import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/PaymentController.js";
const paymentRoute = express.Router();
paymentRoute.post("/coupon/new", adminOnly, newCoupon);
paymentRoute.get("/coupon/all", adminOnly, allCoupons);
paymentRoute.delete("/coupon/:id", adminOnly, deleteCoupon);
paymentRoute.get("/discount", applyDiscount);
export default paymentRoute;
