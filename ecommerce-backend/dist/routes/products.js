import express from "express";
import { newProduct } from "../controllers/ProductConroller.js";
import { singleUpload } from "../middlewares/multer.js";
const productRoute = express.Router();
productRoute.post("/new", singleUpload, newProduct);
export default productRoute;
