import { NextFunction, Request, Response } from "express";

export interface IUserRequest {
  _id: string;
  name: string;
  email: string;
  photo: string;

  gender: string;
  dob: Date;
}
export interface IProductRequest {
 
  name: string;
  price:number;
  stock:number;
  category:string;



}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
