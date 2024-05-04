// we will use this filw when we encounter an error
import { ControllerType } from "../types/types.js";
import errorHandler from "../utils/utility-class.js";
import { NextFunction, Request, Response, } from "express";

export const errorMiddleware = (
   err:  errorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
   err.message ||= "Internal Server Error"
   err.statusCode ||= 500
  return res.status(err.statusCode).json({ success: false, message: err.message });
};


export const TryCatch = (func:ControllerType)=>(req:Request , res:Response , next: NextFunction)=>{
    return Promise.resolve(func(req,res,next)).catch(next)
}