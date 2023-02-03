import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import userModel, { IUser, IUserLeanDoc } from "../models/userModel";
import { JWT_SECRET } from "../config/ENV";
import { customError } from "../utils/customError";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

type Tjwt = {
    _id: string,
    email: string,
    iat: number
}

declare module "express-serve-static-core" {
    interface Request {
      user?: IUserLeanDoc;
    }
  }
  

export const authorization =  asyncHandler(
    async (req: Request, res:Response, next: NextFunction)=>{

        // token verification
        const token = req.cookies.access_token;
        console.log("cookie: ",req.cookies);
        
        if (!token) throw new customError(401, "authorization failed: missing access_token.")

        const {email, _id, iat} = jwt.verify(token, JWT_SECRET!) as Tjwt;
        if (!_id) throw new customError(400, "authorization failed: invalid access_token.")
    
        // user fetching 
        const user = await userModel.findById(_id).lean();
        if (!user) throw new customError(404, "authorization failed: user doesn't exist.")
    
        // attaching user with the request
        req.user = user 
        next();
    
    }
)