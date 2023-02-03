import mongoose, { Date, Document, Model } from "mongoose";
import { customError } from "../utils/customError";

export interface IUser {
    username: string;
    fullname: string;
    email: string;
    password:string;
    image: string;
    age: number;
    gender: string;
    isGoogleCreated?: Boolean;
}

export interface IUserDoc extends IUser, Document{}

export interface IUserLeanDoc extends IUser {
    _id: mongoose.Types.ObjectId,
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        required: true,
        type: String,
        unique: true
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        type: String,
        // here password is not required for a user that signs up using google auth
        // But other users must have a password
        // must be handle this in the validation phase
    },
    image: {
        type: String,
        default: "https://w7.pngwing.com/pngs/831/88/png-transparent-user-profile-computer-icons-user-interface-mystique-miscellaneous-user-interface-design-smile-thumbnail.png"
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    isGoogleCreated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


const userModel= mongoose.model<IUserDoc>("User", userSchema);
export default userModel