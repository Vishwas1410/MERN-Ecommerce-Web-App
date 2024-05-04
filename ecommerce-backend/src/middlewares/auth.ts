//Middleware to make sure only admin is allowed

import { UserModel } from "../models/usermodel.js";
import errorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async (req,res,next) => {
     const {id} = req.query;
     if(!id){
        return next(new errorHandler("Please Login",401))
     }
     
     const user = await UserModel.findById(id);
     if(!user){
        return next(new errorHandler("Invalid ID",401))
     }
     if(user.role !== "admin"){
        return next(new errorHandler("Unauthorized",401))
     }
     next()

})