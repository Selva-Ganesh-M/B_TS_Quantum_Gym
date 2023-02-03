import mongoose from "mongoose"
import { MONGO_URI } from "../config/ENV"

export const connectToDB = async () => {
    mongoose.connect(MONGO_URI!).catch((error)=>{throw error})
}