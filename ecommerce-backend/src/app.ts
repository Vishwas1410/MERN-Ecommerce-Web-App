import { log } from "console";
import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/products.js";
import  NodeCache  from "node-cache";
import orderRoute from "./routes/order.js";
import { config } from "dotenv";
import paymentRoute from "./routes/payment.js";
import cors  from "cors";

import morgan from "morgan"
import statsRoute from "./routes/stats.js";
import Stripe from "stripe";

config({
  path:"./.env"
})



const app = express();
app.use(cors())
const port = process.env.port || 5000;
const MongoDbUrl = process.env.mongoUrl || "";
const stripeKey = process.env.stripeKey || "";
export const stripe = new Stripe(stripeKey)
export const myCache = new NodeCache();
app.use(express.json());
app.use(morgan("dev"))
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);
app.use("/uploads",express.static("uploads"))

connectDB(MongoDbUrl);


app.get("/", (req, res) => {
  res.send("API working with /api/v1");
});

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`server working on http://localhost:${port} `);
});
