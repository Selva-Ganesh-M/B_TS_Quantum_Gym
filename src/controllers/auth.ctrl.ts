import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import userModel, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/ENV";
import { customError } from "../utils/customError";
import hashPassword from "../utils/hashPassword";

const signup = asyncHandler(
    async (req: Request<{},{},IUser&{confirmPassword: string}>, res:Response) => {

        // const {username, age,email,fullname,gender,image,password,confirmPassword} = req.body

        // hashing the password
        const hashedPassword = hashPassword(req.body.password)

        // creating new user
        const user = new userModel<IUser>({...req.body, password: hashedPassword});
        await user.save();

        // fetching newly created user
        const createdUser = await userModel.findOne({email: req.body.email}).lean().select("-password")
        if (!createdUser) {
            throw new customError(422, "user creation is successful. user fetch failed.")
        }
        

        // response
        res.status(201).json({
            status: "success",
            message: "new user is created.",
            payload: createdUser
        })
    }
)

const authController = {signup}
export default authController