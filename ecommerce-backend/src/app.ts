import { log } from "console";
import express from "express";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/products.js";
const app = express();

const port = 5000;
app.use(express.json());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/uploads",express.static("uploads"))

connectDB();
app.get("/", (req, res) => {
  res.send("API working with /api/v1");
});

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`server working on http://localhost:${port} `);
});
