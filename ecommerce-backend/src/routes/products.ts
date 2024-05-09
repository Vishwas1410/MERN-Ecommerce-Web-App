import express from "express";
import { getAllCategories, getAdminProducts, getLatestProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, getAllProducts,  } from "../controllers/ProductConroller.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
import { get } from "http";


const productRoute = express.Router()

productRoute.post("/new",adminOnly,singleUpload,newProduct);
productRoute.get("/latest",getLatestProducts);
productRoute.get("/categories",getAllCategories);
productRoute.get("/all",getAllProducts);
productRoute.get("/admin-products",adminOnly , getAdminProducts);

productRoute.route("/:id").get(getSingleProduct).put(adminOnly,singleUpload,updateProduct).delete(adminOnly,deleteProduct)



export default  productRoute