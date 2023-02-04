import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import userModel, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/ENV";
import { customError } from "../utils/customError";
import hashPassword from "../utils/hashPassword";
import bcrypt from "bcryptjs"

// sign up
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
        statusText:"success",
        statusCode:201,
        message: "new user created",
        payload: createdUser
        })
    }
)


// login

const login = asyncHandler(
    async (req: Request<{}, {}, {email: string, password: string}>, res:Response) => {
        const {email, password} = req.body
        const user = await userModel.findOne({email}).lean()

        // if  no user send message
        if (!user) throw new customError(404, "login failed: requested user can't be found.")

        // if google created ignore password verification
        if (!user.isGoogleCreated){
            // password verification
            const isValidPassword = bcrypt.compareSync(req.body.password, user.password);
            if (!isValidPassword) {
                throw new customError(400, "password mismatch found")
        }
        }

        // jwt prep
        const token = jwt.sign({email, _id:user._id}, JWT_SECRET!)
        // const {password, ...others} = user._doc

        // response prep
        const response = user as Partial<IUser>;
        response.password = undefined;

        // response
        res
        .cookie("access_token", token, {
            httpOnly: true
        })
        .status(200)
        .json({
            statusText: "success",
            statusCode: 200,
            message: "user sign in successful.",
            payload: response
        })

    }
)

const authController = {signup, login}
export default authController